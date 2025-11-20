### 作业详情
使用https://docs.cosmos.network/开发一个自己的区块链

1.能够代币的生产

2.能够新建一个用户

3.能够完成代币的转账

4.矿工

5.有基本区块链浏览器能够查看当前的块高度的还有区块信息

### 操作手册
#### 安装ignite:  curl [https://get.ignite.com/cli!](https://get.ignite.com/cli!) | bash  
#### 生成区块链（需外网）： ignite scaffold chain ignite-my-chain 
#### 启动服务：ignite chain serve
```plain
  🌍 Tendermint node: http://0.0.0.0:26657  （你的区块链节点）链的 核心节点 RPC
  🌍 Blockchain API: http://0.0.0.0:1317  这是链的 REST API 服务
  🌍 Token faucet: http://0.0.0.0:4500 （水龙头）
```

#### 获取链的二进制名：export PATH=$PATH:/Users/shanshanapple/go/bin 这样就可以全局使用自己项目的命令，通过命令行获取当前链上的数据了 我这里的命令是 ignite-my-chaind 和项目名一致
#### 创建一个新账户获取账户：ignite-my-chaind keys add alice2 
![](https://cdn.nlark.com/yuque/0/2025/png/1030999/1763385110298-a455b42d-9c76-4ef0-9eb2-c6159be080dd.png)

#### 查看用户list：ignite-my-chaind keys list
![](https://cdn.nlark.com/yuque/0/2025/png/1030999/1763387160474-7434c8bb-4e71-480a-b4f8-7330b439ea44.png)

#### 请求水龙头给它发 token
```plain
curl -X POST http://localhost:4500/faucet \
  -H "Content-Type: application/json" \
  -d '{"address": "cosmos19zunx76agxa48a9ck3c4all59v30cxujnexldw", "denom": "mycoin", "amount": "1230000"}'
```

#### 查询 alice 余额 curl [http://localhost:1317/cosmos/bank/v1beta1/balances/](http://localhost:1317/cosmos/bank/v1beta1/balances/cosmos1xxxxxxxx){账户address}
#### 转账：ignite-my-chaind tx bank send alice cosmos19zunx76agxa48a9ck3c4all59v30cxujnexldw 10000tokens  
![](https://cdn.nlark.com/yuque/0/2025/png/1030999/1763387375962-5bfc2b81-4e49-41dc-a80d-8043d214581a.png)  
查看当前的验证者也就是矿工 ignite-my-chaind query staking validators
#### 查看区块高度：[http://localhost:26657/status](http://localhost:26657/status)
#### 周日：
#### 1.寻找Sepolia水龙头(发给你测试币的网址)
![](https://cdn.nlark.com/yuque/0/2025/png/1030999/1763521554655-9b5a5249-b47c-4d77-8d8b-f2d3783a55aa.png)

2.使用MetaMask转账到Zero Address 花费gas 

![](https://cdn.nlark.com/yuque/0/2025/png/1030999/1763521788558-02a320f6-68aa-4497-8df0-19a0b778679b.png)

3.最好在测试网完成[https://sepolia.etherscan.io/](https://sepolia.etherscan.io/)

区块链浏览器数据查看![](https://cdn.nlark.com/yuque/0/2025/png/1030999/1763521943944-9326745b-b832-4b45-8479-64d99c0f7422.png)

![](https://cdn.nlark.com/yuque/0/2025/png/1030999/1763521961203-e6860cb9-12f0-4ba1-8706-d4a8b10394fc.png)

4.对16进制的数据有一个自己的加密和解密方式

```javascript
const crypto = require("crypto");
// 可自定义的 key 和 iv（保持 32 字节 key、16 字节 iv）
const KEY = crypto.randomBytes(32); // 256-bit 密钥
const IV = crypto.randomBytes(16); // 128-bit 初始化向量，保证同一个key也能加密出不同的结果

function encryptHex(hexString) {
  //创建一个 AES 加密器对象
  const cipher = crypto.createCipheriv("aes-256-cbc", KEY, IV);
  //   把 update() 和 final() 输出的两个 Buffer 合并在一起，得到完整密文。
  const encrypted = Buffer.concat([
    // 把你的 hex 字符串转成二进制 Buffer 然后 对数据分块进行加密。。
    cipher.update(Buffer.from(hexString, "hex")),
    // 关闭加密流，并输出最后一块加密数据。
    cipher.final(),
  ]);
  //   把加密后的二进制密文 转成 hex 字符串并返回。
  return encrypted.toString("hex");
}

// ------- HEX 数据解密：输入 hex → 输出 hex -------
function decryptHex(hexString) {
  //创建一个 AES 解密器对象
  const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, IV);
  //   把你的 hex 字符串转成二进制 Buffer 然后 对数据分块进行解密。
  const decrypted = Buffer.concat([
    // 关闭解密流，并输出最后一块解密数据。
    decipher.update(Buffer.from(hexString, "hex")),
    decipher.final(),
  ]);
  //   把解密后的二进制明文 转成 hex 字符串并返回。
  return decrypted.toString("hex");
}

// 测试
const originalHex = "A1B2C3D4FFEE1234";
const encrypted = encryptHex(originalHex);
const decrypted = decryptHex(encrypted);

console.log("原文 HEX:", originalHex);
console.log("加密 HEX:", encrypted);
console.log("解密 HEX:", decrypted);

// 原文 HEX: A1B2C3D4FFEE1234
// 加密 HEX: 11fe02ba6332decd59c1a08210b8e05d
// 解密 HEX: a1b2c3d4ffee1234

```

2种方式数据上链：

做一个完整的界面，数据上链分为2种方式

直接转账方式 下面这2种

1.使用Ether.js读取链上数据

1-1.使用[https://www.infura.io/zh](https://www.infura.io/zh)、Aalchemy读取链上的数据

2.写一个合约专门来写链上的数据通过日志的形式（要求部署到测试链）

2-1.使用The Graph把数据读回来

2-2.通过转U的形式 读取USDT的合约地址+链的数据 HASH/ID 读回来（选修）

关键一个完整的 右上角把钱包的操作加上

web3-react Wagmi conneckit rainbowkit

#### 使用nextjs创建 项目，并安装 [安装 — RainbowKit](https://rainbowkit.com/zh-CN/docs/installation) 
获取projectID的地址 [projectId地址](https://dashboard.reown.com/8cbaf04b-92dd-4452-9e6c-31e01d579302/b1330821-02c8-4e8a-a4a6-fce73e7b74e0)

#### [https://developer.metamask.io/](https://developer.metamask.io/) 通过infura 获取 sepolia链上信息
![](https://cdn.nlark.com/yuque/0/2025/png/1030999/1763624037989-97f06c45-5587-4767-b5f4-5b571ed23cbd.png)

#### 获取只读provider
```javascript
const provider = new JsonRpcProvider(rpcUrl);

provider.getBlockNumber()      // 区块高度
provider.getFeeData()  // 获取当前 Gas 费用信息
provider.getBalance(address)  // 余额
provider.getTransaction(hash) // 交易详情
```

#### 使用foundry创建 合约
forge init web3-base-constract

合约书写

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title OnChainLogger
/// @notice 用事件(Event)记录链上数据
contract OnChainLogger {
  address public owner;
  /// @notice 日志事件（The Graph 将监听此事件）
  event DataLogged(
    address indexed sender,  // 可索引发起人
    string tag,              // 分类或类型
    string content,          // 实际要记录的数据
    uint256 timestamp        // 写入时间
  );

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
  }

  /// @notice 只有发布者才有权限写日志方法
  function log(string calldata tag, string calldata content) external onlyOwner {
    // 通知所有的订阅合约的人
    emit DataLogged(msg.sender, tag, content, block.timestamp);
  }
}

```

#### 发布合约 可以直接用命令行 正规的用script这样更便捷和规范一些
1. 首先使用命令行的方式- 不建议主要是不安全且复杂

```solidity
source .env
forge create --rpc-url $RPC_URL --private-key $PRIVATE_KEY src/MyToken.sol:MyToken
```

2. 使用 scripts的方式推荐

```solidity
forge script script/OnChainLogger.s.sol:OnChainLoggerScript --broadcast -vvvv
```

![](https://cdn.nlark.com/yuque/0/2025/png/1030999/1763610176655-368171fc-2a85-4e40-9b9d-a7f407fe9bad.png)

#### 部署后查询
合约地址： 0xD52D7380fD86c8D73d23b941ef3C0C7DA073478d

[https://sepolia.etherscan.io/](https://sepolia.etherscan.io/)

![](https://cdn.nlark.com/yuque/0/2025/png/1030999/1763610656221-500faab0-5491-4333-8cee-4c882c000d30.png)

#### 导出ABI
forge build 之后在 out/<ContractName>.sol/<ContractName>.json 中可以找到 对应合约的ABI

#### 创建 Subgraph 
[https://thegraph.com/studio/](https://thegraph.com/studio/)

![](https://cdn.nlark.com/yuque/0/2025/png/1030999/1763622766849-b9227671-7733-4b59-ad36-d1f41c3bb8ea.png)

#### 本地安装 The graph的cli
pnpm add -g @graphprotocol/graph-cli

graph init - 这一步会提示你的合约没验证需要 到 [https://sepolia.etherscan.io/](https://sepolia.etherscan.io/) 

进行 verify

![](https://cdn.nlark.com/yuque/0/2025/png/1030999/1763619696325-af8ddd06-d885-4ea0-9177-46f22650ee07.png)

![](https://cdn.nlark.com/yuque/0/2025/png/1030999/1763622031576-c5566413-d645-4faa-94f5-54a848926875.png)

执行完成后会生成个文件夹这个文件夹的名称就是 slug的名字

graph codegen && graph build  

接着授权，授权的信息来自于 [https://thegraph.com/studio/subgraph/onchainlogger/?show=Metadata](https://thegraph.com/studio/subgraph/onchainlogger/?show=Metadata)  
graph auth b8d8cff41ac2e5787309b47b5d396ca9   

graph deploy onchainlogger 部署，onchainlogger 这个名称要和**Display Name 保持一致  
****然后返回 结果 Queries (HTTP):     **[**https://api.studio.thegraph.com/query/1716051/onchainlogger/0.01**](https://api.studio.thegraph.com/query/1716051/onchainlogger/0.01)

#### 前端代码书写
1. 获取ABI 和 合约对象

 new ethers.Contract(CONTRACT_ADDRESS, ABI, signer || provider);

2. 调用合约方法 写入log

await contract.log(trimmedTag, trimmedContent); 

3. 使用 前面部署好的thegraph 获取日志

****

****

  


  




####   

#### 
