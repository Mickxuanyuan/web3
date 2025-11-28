在 **50万车辆 (50w)** 的数据量级下，IndexedDB (IDB) 如果使用不当，会成为浏览器最大的卡顿源（因为磁盘 I/O 远慢于内存读写）。

在这个项目中，IndexedDB **绝对不能**用来做“实时存储”，它的角色必须重新定义为：**“冷备”与“快照”**。

以下是针对该项目的 **IndexedDB 深度优化方案**，包含核心策略、数据结构设计和代码实现细节。

-----

### 🚀 核心优化策略

#### 1\. 写入策略：从“流式写入”改为“快照写入” (Snapshot)

  * **错误做法：** 每收到 WebSocket 的 50w 数据，就遍历插入 50w 条记录到 IDB。
      * *后果：* IDB 事务频繁开启，浏览器磁盘 I/O 爆满，写入速度赶不上推送速度，导致队列积压。
  * **正确做法：** **只存“整体”**。
      * 把 Web Worker 里的 `Float32Array` (即 50w 辆车的二进制数据) 当作 **一条记录** 存进去。
      * *Key:* `'latest_snapshot'`
      * *Value:* `ArrayBuffer` (约 6MB)

#### 2\. 频率控制：节流 (Throttling)与 关键节点触发

  * **不要：** 每 5秒 存一次。IDB 存 6MB 数据可能需要 100-500ms，太频繁会抢占 CPU。
  * **要：**
      * **定时存：** 每 **1 - 3 分钟** 存一次自动备份。
      * **事件存：** 监听 `pagehide` / `beforeunload` (页面关闭/刷新) 事件，尝试存最后一次。

#### 3\. 存储结构：大二进制对象 (BLOB/Buffer)

  * **不要：** 存对象数组 `[{id:1...}, {id:2...}]`。结构化克隆（Serialization）50万个对象非常耗时。
  * **要：** 直接存 **ArrayBuffer**。
      * 浏览器存二进制流极快，几乎没有序列化开销。

-----

### 🛠️ 详细落地细节

#### 1\. Schema 设计 (极简)

我们需要建立两个 ObjectStore（表）：

| ObjectStore 名称 | KeyPath | 索引 (Index) | 用途 | 写入频率 |
| :--- | :--- | :--- | :--- | :--- |
| **`snapshots`** | `type` (主键) | 无 | **核心：** 存储全量车辆的二进制快照。 | 低频 (1分钟/次) |
| **`tracks`** | `vehicleId` | `startTime` | **辅助：** 存储用户点击过的单车历史轨迹。 | 按需 (用户点击时) |

#### 2\. 代码实现 (写在 Web Worker 中)

这是基于 `idb` 库（推荐使用 `idb` 这个轻量级 Promise 包装库）的优化实现。

```javascript
import { openDB } from 'idb';

const DB_CONFIG = {
    name: 'VehicleMonitorDB',
    version: 1,
    store: 'snapshots'
};

let dbPromise = null;

// 1. 初始化 DB
async function initDB() {
    dbPromise = openDB(DB_CONFIG.name, DB_CONFIG.version, {
        upgrade(db) {
            // 创建快照表，主键是 type
            if (!db.objectStoreNames.contains('snapshots')) {
                db.createObjectStore('snapshots', { keyPath: 'type' });
            }
            // 创建轨迹表 (可选)
            if (!db.objectStoreNames.contains('tracks')) {
                const trackStore = db.createObjectStore('tracks', { keyPath: 'id' });
                trackStore.createIndex('by_vehicle', 'vehicleId');
            }
        },
    });
}

// 2. 核心：高性能保存快照
// 接收 Web Worker 里的 Float32Array (全量数据)
async function saveSnapshot(float32Array) {
    const db = await dbPromise;
    if (!db) return;

    const tx = db.transaction('snapshots', 'readwrite');
    
    // 【关键优化】：直接存 Buffer，不要转对象数组！
    // 这样 50w 数据只是一次 I/O 操作，而不是 50w 次。
    await tx.store.put({
        type: 'latest',
        timestamp: Date.now(),
        // 这里的 buffer 是 ArrayBuffer，约 6-8 MB
        data: float32Array.buffer 
    });
    
    await tx.done;
    console.log('[IDB] Snapshot saved.');
}

// 3. 核心：高性能读取快照 (用于秒开)
async function loadSnapshot() {
    const db = await dbPromise;
    if (!db) return null;

    const record = await db.get('snapshots', 'latest');
    if (!record) return null;

    // 检查数据是否过期 (例如超过 1 小时的数据就没意义了)
    if (Date.now() - record.timestamp > 3600 * 1000) {
        return null;
    }

    // 直接返回 ArrayBuffer，可以直接喂给 Float32Array 恢复状态
    return record.data; 
}
```

#### 3\. 接入工作流

我们需要修改之前的 Worker 流程，把 IDB 作为一个\*\*“旁路系统”\*\*加入进去。

```javascript
// vehicle.worker.js

let lastSaveTime = 0;
const SAVE_INTERVAL = 60 * 1000; // 1分钟

// ... WebSocket 收到数据处理完 SoA 数组后 ...

// 在处理完 renderBuffer 后
function trySaveToIDB(renderBuffer) {
    const now = Date.now();
    
    // 节流控制
    if (now - lastSaveTime > SAVE_INTERVAL) {
        // 这里的 renderBuffer 是 Float32Array
        // 注意：IDB存储是异步的，不要 await 阻塞主流程，让它后台跑
        saveSnapshot(renderBuffer).catch(err => console.error(err));
        lastSaveTime = now;
    }
}
```

-----

### 🔍 为什么这个方案能成？(性能对比)

假设数据量为 50w 条。

| 方案 | 操作方式 | 序列化开销 | 事务开销 | 写入耗时 (预估) | 结论 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **传统方案** | 循环 `put` 50w 次对象 | 极高 (50w 次克隆) | 极高 (浏览器索引维护) | **10s - 30s** (浏览器卡死) | ❌ 必死 |
| **Bulk 方案** | `bulkPut` (如 Dexie) | 高 (50w 次克隆) | 中 | **2s - 5s** | ⚠️ 勉强，但卡顿 |
| **快照方案** | **`put` 1 次二进制流** | **接近 0** (直接存内存块) | **极低** (1 次) | **\< 100ms** | ✅ **完美** |

### ⚠️ 潜在坑点与解决

1.  **QuotaExceededError (容量超限)**

      * *问题：* 用户的磁盘空间不足。
      * *解决：* 在 `saveSnapshot` 里加 `try-catch`。如果报错，直接放弃存储，不要让程序崩溃。监控场景下，离线缓存不是必须的，它是锦上添花。

2.  **版本冲突 (Schema Change)**

      * *问题：* 如果将来你的二进制结构变了（比如从每车 4 个字段变成 5 个字段）。旧的快照读取出来会导致数据错位。
      * *解决：* 在存 IDB 时，多存一个字段 `schemaVersion: 1`。读取时比对，如果版本对不上，直接丢弃旧缓存。

3.  **页面关闭时的可靠性**

      * *问题：* `beforeunload` 中 IDB 的写入可能因为页面关闭而被中断。
      * *解决：* 尽力而为。或者尝试使用 `Service Worker` 来维持写入（比较复杂，通常不需要做到这么极致）。一般的策略是：**“每分钟存一次”已经足够好了**，用户刷新时回退最多 1 分钟的状态是可以接受的。

### 总结优化清单

1.  **存什么：** 只存 **ArrayBuffer** (Float32Array.buffer)，不要存 JSON 对象。
2.  **怎么存：** 当作 **一条记录** (`key: 'latest'`) 存，不要存 50w 条记录。
3.  **何时存：** **节流** (1分钟/次) + **离场** (beforeunload)。
4.  **哪里跑：** 必须在 **Web Worker** 里跑，绝对不要在主线程操作 IDB。