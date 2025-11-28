/**
 * Vehicle Worker - 前端核心数据处理中心
 * 职责：连接 WS、解包、比对去噪、生成渲染数据、持久化存储
 * 运行位置：Web Worker，避免阻塞主线程渲染；通过 postMessage 与主线程通讯
 * 输入：WS 下行的二进制包（假设 protobuf/定长结构）；输出：供渲染层的 Float32Array
 */

// --- 1. 配置常量 ---
const CONFIG = {
    // 阈值：经纬度变化小于此值视为静止（约 5 米），解决 GPS 漂移震荡
    MOVE_THRESHOLD: 0.00005, 
    // 心跳间隔
    HEARTBEAT_INTERVAL: 30000,
    // IDB 存储名称
    DB_NAME: 'VehicleMonitorDB',
    DB_STORE: 'snapshots'
};

// --- 2. 内存数据库 (State) ---
// Key: vehicleId (int), Value: { lat, lng, status, ... }
// 作用：持有“当前真值”，方便 diff/去噪/写入 IDB
const vehicleMap = new Map();

// 用于 IndexedDB 的缓冲；避免重入写导致事务冲突
let isSavingToDB = false;

// --- 3. 工具类：IndexedDB 管理 ---
const dbManager = {
    db: null,
    async init() {
        return new Promise((resolve, reject) => {
            // 打开（或创建）数据库，版本号=1；版本号变化会触发 onupgradeneeded
            const request = indexedDB.open(CONFIG.DB_NAME, 1);
            request.onupgradeneeded = (event) => {
                // 首次创建或版本号升级时触发；用于定义数据表结构（只在这里建表）
                const db = event.target.result;
                if (!db.objectStoreNames.contains(CONFIG.DB_STORE)) {
                    // keyPath 使用 timestamp，存储不同时间点的快照
                    db.createObjectStore(CONFIG.DB_STORE, { keyPath: 'timestamp' });
                }
            };
            request.onsuccess = (event) => {
                // 缓存 db 句柄，后续事务直接复用；此处不返回事务，保持简洁
                this.db = event.target.result;
                resolve();
            };
            // 初始化失败直接 reject，由调用方决定是否降级处理
            request.onerror = (err) => reject(err);
        });
    },
    // 保存快照 (异步，不阻塞)
    async saveSnapshot(vehiclesArray) {
        if (!this.db || isSavingToDB) return;
        isSavingToDB = true;
        
        try {
            // 单次事务写入最新数据；读写模式允许 put 覆盖
            const tx = this.db.transaction([CONFIG.DB_STORE], 'readwrite');
            const store = tx.objectStore(CONFIG.DB_STORE);
            // 只存最近的一份快照，key 固定为 'latest'，或者按时间存历史
            // 这里演示存最新的一份，覆盖旧的，节省空间
            const snapshot = {
                timestamp: 'latest', 
                data: vehiclesArray, // 注意：这里最好存紧凑的数组，不要存对象数组
                updatedAt: Date.now()
            };
            store.put(snapshot);
            
            // 事务结束时释放锁，避免下一次存储被堵住
            tx.oncomplete = () => { isSavingToDB = false; };
        } catch (e) {
            console.error('IDB Save Error:', e);
            isSavingToDB = false;
        }
    }
};

// --- 4. 核心逻辑：WebSocket 管理与数据处理 ---
class VehicleDataManager {
    constructor(url) {
        // url: WS 服务器地址；其他成员在运行时动态更新
        this.url = url;
        this.ws = null;
        this.reconnectTimer = null;
        this.heartbeatTimer = null;
        this.retryCount = 0;
    }

    connect() {
        // 若存在旧连接，先关闭；避免事件残留和资源占用
        if (this.ws) this.ws.close();
        
        // 每次重连都创建新实例，确保 binaryType 设置在 onopen 之前完成
        this.ws = new WebSocket(this.url);
        this.ws.binaryType = 'arraybuffer'; // 【关键】接收二进制，避免浏览器默认转字符串

        this.ws.onopen = () => {
            console.log('[Worker] WS Connected');
            this.retryCount = 0;
            this.startHeartbeat();
            // 通知主线程连接状态，可用于 UI 或重置本地计数
            self.postMessage({ type: 'STATUS', payload: 'CONNECTED' });
        };

        this.ws.onmessage = (event) => {
            // 原始二进制 buffer 直接进入处理管道，避免中间 JSON 解析开销
            this.handleData(event.data);
        };

        this.ws.onclose = () => {
            console.log('[Worker] WS Closed, reconnecting...');
            this.stopHeartbeat();
            // 主动调度重连而不是依赖浏览器自动重试，便于指数退避
            this.scheduleReconnect();
        };
        
        this.ws.onerror = (e) => console.error('[Worker] WS Error', e);
    }

    /**
     * 【核心】数据处理管道
     * 1. 解码 -> 2. 比对(Diff) -> 3. 更新内存 -> 4. 生成渲染 View -> 5. 存储
     */
    handleData(arrayBuffer) {
        // 假设前4个字节是时间戳，后面是车辆数据体
        // 实际请使用 protobuf.decode(new Uint8Array(arrayBuffer))
        // 这里模拟解码过程：
        // 假设每辆车结构: ID(4byte) + Lat(4byte) + Lng(4byte) + Status(1byte) = 13 bytes
        const BYTES_PER_CAR = 13;
        // DataView 允许按字节偏移读取多种类型，这里使用小端（true）
        const view = new DataView(arrayBuffer);
        const totalCars = Math.floor(arrayBuffer.byteLength / BYTES_PER_CAR);

        // 准备发送给主线程的 Float32Array (结构化数组)
        // 格式: [id, lat, lng, status, 0, id, lat, lng, status, 0...] 
        // 预留5位，为了内存对齐或增加额外字段(如颜色)；方便一次性传输到 GPU
        const STRIDE = 5; 
        const renderData = new Float32Array(totalCars * STRIDE);

        let validCount = 0; // 实际需要渲染的数量

        for (let i = 0; i < totalCars; i++) {
            const offset = i * BYTES_PER_CAR;
            const id = view.getInt32(offset, true); // ID
            // 假设坐标被放大了100万倍传过来的整数
            const lat = view.getInt32(offset + 4, true) / 1000000; 
            const lng = view.getInt32(offset + 8, true) / 1000000;
            const status = view.getUint8(offset + 12);

            // --- Diff Engine (差异比对) ---
            const oldCar = vehicleMap.get(id);
            let finalLat = lat;
            let finalLng = lng;
            let isMoving = true;

            if (oldCar) {
                // 计算曼哈顿距离(粗略)或欧氏距离，判断是否真的动了
                const delta = Math.abs(lat - oldCar.lat) + Math.abs(lng - oldCar.lng);
                
                if (delta < CONFIG.MOVE_THRESHOLD) {
                    // 【纠偏】如果没有超过阈值，认为没动，强行使用老坐标
                    // 作用：消除 GPS 静态漂移抖动
                    finalLat = oldCar.lat;
                    finalLng = oldCar.lng;
                    isMoving = false;
                    
                    // 如果状态也没变，甚至可以不需要更新 map，
                    // 但为了保持 heartbeat，通常还是会更新时间戳
                }
            }

            // 更新内存数据库 (这里是最新真值)
            vehicleMap.set(id, { lat: finalLat, lng: finalLng, status, lastUpdate: Date.now() });

            // --- 构建渲染数据 ---
            // 只有当真正发生移动，或者首次出现，或者状态改变时，才推送到渲染层？
            // 策略 A：全量推送 (适合 Deck.gl transition 动画)
            // 策略 B：只推变化的 (适合省性能)
            // 这里采用 策略 A，因为 Deck.gl 需要连续数据做插值
            
            const index = validCount * STRIDE;
            renderData[index] = id;             // 顶点着色器可用 id 查其他纹理数据
            renderData[index + 1] = finalLng;   // 注意经纬度顺序，符合地图坐标需求
            renderData[index + 2] = finalLat;   // 使用 float32 足够精度
            renderData[index + 3] = status;     // 业务状态（例如在线/离线）
            renderData[index + 4] = isMoving ? 1 : 0; // 标记位，用于 shader 决定是否闪烁等

            validCount++;
        }

        // --- 发送给主线程 ---
        // 使用 slice 切掉多余的 buffer (如果有)
        const finalBuffer = renderData.slice(0, validCount * STRIDE).buffer;
        
        self.postMessage({
            type: 'UPDATE_RENDER',
            buffer: finalBuffer,
            count: validCount
        }, [finalBuffer]); // Zero-Copy 移交所有权

        // --- 异步触发存储 (每收到一次全量包存一次太频繁，可以加节流) ---
        // 这里简单演示：每收到数据就尝试存一次（内部有锁控制并发）
        // 实际建议只存 vehicleMap.values() 的序列化结果
        this.triggerSave();
    }

    triggerSave() {
        // 转换 map 为紧凑数组用于存储
        // 注意：IndexedDB 存 Map 兼容性一般，建议转 Array
        if (!isSavingToDB) {
            // 这是一个耗时操作，不要每次都做，可以用 debounce；此处示例直接触发
            const snapshotData = Array.from(vehicleMap.values());
            dbManager.saveSnapshot(snapshotData);
        }
    }

    startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                // 发送简单的 Ping
                this.ws.send(new Uint8Array([0x9])); 
            }
        }, CONFIG.HEARTBEAT_INTERVAL);
    }

    stopHeartbeat() {
        // 清掉心跳定时器，防止重复开启；close/onclose 都会调用
        if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    }

    scheduleReconnect() {
        // 指数退避：1s,2s,4s...，上限 30s，避免频繁打爆服务器
        const timeout = Math.min(1000 * (2 ** this.retryCount), 30000);
        this.retryCount++;
        
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
            console.log(`[Worker] Reconnecting... (Attempt ${this.retryCount})`);
            this.connect();
        }, timeout);
    }
}

// --- 5. 启动 ---
// 初始化 IDB
dbManager.init().then(() => {
    console.log('[Worker] DB Initialized');
});

const manager = new VehicleDataManager('wss://your-api.com/socket');

// 监听主线程控制指令
self.onmessage = (e) => {
    if (e.data.type === 'START') {
        // 主线程要求启动连接；通常在地图 ready 或用户点击“开始”后触发
        manager.connect();
    }
    if (e.data.type === 'FORCE_SAVE') {
        // 主线程要求立即落盘；如退出页面前或用户手动保存
        manager.triggerSave();
    }
};
