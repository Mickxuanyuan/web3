# Anvil 使用指南

Anvil 是 Foundry 套件中的本地以太坊节点，用于快速开发和测试智能合约。

## 基本用法

### 1. 启动 Anvil（默认配置）

```bash
anvil
```

默认配置：
- **端口**: 8545
- **RPC URL**: http://localhost:8545
- **账户数量**: 10 个测试账户
- **每个账户余额**: 10,000 ETH
- **区块时间**: 即时出块（0秒）

启动后会显示：
- 10 个测试账户的私钥和地址
- RPC URL
- 账户余额

### 2. 常用启动选项

```bash
# 指定端口
anvil --port 8545

# 指定账户数量
anvil --accounts 20

# 指定每个账户的余额（单位：ETH）
anvil --balance 5000

# 指定出块时间间隔（秒）
anvil --block-time 2

# 组合使用
anvil --accounts 5 --balance 100000 --block-time 1 --port 8545
```

### 3. 后台运行

```bash
# 后台运行并输出日志到文件
anvil > anvil.log 2>&1 &

# 或者使用 nohup
nohup anvil > anvil.log 2>&1 &

# 查看日志
tail -f anvil.log
```

### 4. 停止 Anvil

```bash
# 查找进程
lsof -i :8545

# 停止进程（替换 PID）
kill <PID>

# 或者直接停止所有 anvil 进程
pkill anvil
```

## 与 Forge Script 配合使用

### 1. 部署合约到 Anvil

```bash
# 启动 Anvil（在一个终端）
anvil

# 在另一个终端运行部署脚本
forge script script/DeployAll.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key <PRIVATE_KEY>
```

### 2. 使用 Anvil 账户

Anvil 启动时会显示测试账户的私钥，可以直接使用：

```bash
# 使用第一个账户部署（从 Anvil 输出中复制私钥）
forge script script/DeployAll.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### 3. 使用环境变量

```bash
# 设置私钥环境变量
export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# 使用环境变量
forge script script/DeployAll.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast
```

### 4. 使用 --fork-url 进行分叉测试

```bash
# 分叉主网（需要网络连接）
anvil --fork-url https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# 分叉测试网
anvil --fork-url https://sepolia.infura.io/v3/YOUR_API_KEY

# 分叉到特定区块
anvil --fork-url https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY --fork-block-number 18000000
```

## 常用操作

### 1. 查看账户余额

```bash
# 使用 cast（Foundry 工具）
cast balance <ADDRESS> --rpc-url http://localhost:8545

# 使用 curl
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["<ADDRESS>","latest"],"id":1}' \
  http://localhost:8545
```

### 2. 发送交易

```bash
# 使用 cast 发送 ETH
cast send <TO_ADDRESS> --value 1ether \
  --private-key <PRIVATE_KEY> \
  --rpc-url http://localhost:8545

# 调用合约函数
cast send <CONTRACT_ADDRESS> "functionName(uint256)" 123 \
  --private-key <PRIVATE_KEY> \
  --rpc-url http://localhost:8545
```

### 3. 查询合约状态

```bash
# 读取状态变量
cast call <CONTRACT_ADDRESS> "variableName()" \
  --rpc-url http://localhost:8545

# 调用 view 函数
cast call <CONTRACT_ADDRESS> "getCourse(uint256)" 1 \
  --rpc-url http://localhost:8545
```

### 4. 模拟时间推进

```bash
# 增加区块号
cast rpc anvil_mine 10 --rpc-url http://localhost:8545

# 增加时间（秒）
cast rpc anvil_increaseTime 3600 --rpc-url http://localhost:8545

# 设置区块时间戳
cast rpc anvil_setTime $(date +%s) --rpc-url http://localhost:8545
```

## 高级功能

### 1. 状态快照和恢复

```bash
# 创建快照
cast rpc evm_snapshot --rpc-url http://localhost:8545

# 恢复快照（使用返回的快照 ID）
cast rpc evm_revert <SNAPSHOT_ID> --rpc-url http://localhost:8545
```

### 2. 设置账户余额

```bash
# 设置账户余额
cast rpc anvil_setBalance <ADDRESS> 0x1000000000000000000 \
  --rpc-url http://localhost:8545
```

### 3. 模拟账户

```bash
# 模拟账户（无需私钥即可签名交易）
cast rpc anvil_impersonateAccount <ADDRESS> --rpc-url http://localhost:8545

# 停止模拟
cast rpc anvil_stopImpersonatingAccount <ADDRESS> --rpc-url http://localhost:8545
```

### 4. 设置代码

```bash
# 在地址上设置合约代码
cast rpc anvil_setCode <ADDRESS> <BYTECODE> --rpc-url http://localhost:8545
```

## 实际使用示例

### 完整部署流程

```bash
# 1. 启动 Anvil
anvil --accounts 10 --balance 10000

# 2. 部署合约（在另一个终端）
forge script script/DeployAll.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --verify

# 3. 与合约交互
cast send <CONTRACT_ADDRESS> "functionName()" \
  --private-key <PRIVATE_KEY> \
  --rpc-url http://localhost:8545
```

### 测试场景

```bash
# 1. 创建快照
SNAPSHOT=$(cast rpc evm_snapshot --rpc-url http://localhost:8545 | jq -r)

# 2. 执行测试操作
cast send <CONTRACT> "testFunction()" --private-key <KEY> --rpc-url http://localhost:8545

# 3. 恢复快照，重新测试
cast rpc evm_revert $SNAPSHOT --rpc-url http://localhost:8545
```

## 故障排查

### 1. 端口被占用

```bash
# 查找占用端口的进程
lsof -i :8545

# 使用其他端口
anvil --port 8546
```

### 2. 连接失败

```bash
# 检查 Anvil 是否运行
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545
```

### 3. 查看 Anvil 日志

如果 Anvil 在后台运行，查看日志文件：
```bash
tail -f anvil.log
```

## 最佳实践

1. **开发环境**：使用默认配置快速启动
2. **测试环境**：使用固定账户数量和余额，便于测试
3. **分叉测试**：使用 `--fork-url` 测试与主网/测试网的交互
4. **状态管理**：使用快照功能快速重置状态
5. **时间测试**：使用 `anvil_increaseTime` 测试时间相关的功能

## 相关工具

- **cast**: Foundry 的命令行工具，用于与链交互
- **forge**: Foundry 的构建和测试工具
- **chisel**: Foundry 的 Solidity REPL

## 参考资源

- [Foundry Book - Anvil](https://book.getfoundry.sh/anvil/)
- [Foundry Book - Cast](https://book.getfoundry.sh/reference/cast/)

