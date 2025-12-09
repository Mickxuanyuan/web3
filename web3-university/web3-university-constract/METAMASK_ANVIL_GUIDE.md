# MetaMask 连接 Anvil 本地节点指南

## 步骤 1: 启动 Anvil（确保允许外部连接）

```bash
# 启动 Anvil，允许外部连接（重要！）
anvil --host 0.0.0.0 --port 8545
```

**注意**：`--host 0.0.0.0` 允许从其他设备（包括浏览器）连接到 Anvil。

启动后，Anvil 会显示类似以下的信息：

```
Available Accounts
==================

(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

(1) 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

...

Wallet
==================
Mnemonic:  test test test test test test test test test test test junk
Base HD Path:  m/44'/60'/0'/0/{account_index}

Chain ID:  31337
```

## 步骤 2: 在 MetaMask 中添加本地网络

### 方法一：通过 MetaMask UI 添加

1. **打开 MetaMask 扩展**
   - 点击右上角的网络选择器（显示当前网络名称）
   - 滚动到底部，点击 "添加网络" 或 "Add Network"

2. **手动添加网络**
   - 点击 "手动添加网络" 或 "Add a network manually"

3. **填写网络信息**
   ```
   网络名称 (Network Name): Anvil Local
   RPC URL: http://localhost:8545
   链 ID (Chain ID): 31337
   货币符号 (Currency Symbol): ETH
   区块浏览器 URL (Block Explorer URL): (留空)
   ```

4. **保存网络**
   - 点击 "保存" 或 "Save"

### 方法二：通过 MetaMask 设置添加

1. 打开 MetaMask → 设置 (Settings)
2. 选择 "网络" (Networks)
3. 点击 "添加网络" (Add Network)
4. 选择 "手动添加" (Add a network manually)
5. 填写上述网络信息

## 步骤 3: 导入 Anvil 账户到 MetaMask

### 方法一：使用私钥导入（推荐）

1. **复制 Anvil 输出的私钥**
   - 从 Anvil 启动信息中复制任意账户的私钥
   - 例如：`0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

2. **在 MetaMask 中导入账户**
   - 点击 MetaMask 右上角的账户图标
   - 选择 "导入账户" (Import Account)
   - 选择 "私钥" (Private Key)
   - 粘贴私钥并点击 "导入" (Import)

### 方法二：使用助记词导入

1. **复制 Anvil 的助记词**
   - 从 Anvil 输出中复制助记词
   - 例如：`test test test test test test test test test test test junk`

2. **在 MetaMask 中导入**
   - 点击账户图标 → "设置" (Settings)
   - 选择 "安全和隐私" (Security & Privacy)
   - 选择 "显示助记词" (Reveal Secret Recovery Phrase)
   - 或者直接使用 "导入账户" → "助记词"

**注意**：使用助记词会替换当前钱包，请谨慎操作！

## 步骤 4: 切换到 Anvil 网络

1. 在 MetaMask 中点击网络选择器
2. 选择 "Anvil Local" 网络
3. 确认账户余额显示为 10000 ETH（或 Anvil 配置的余额）

## 步骤 5: 验证连接

### 检查账户余额

在 MetaMask 中应该能看到：
- 网络：Anvil Local (31337)
- 账户余额：10000 ETH（或配置的余额）

### 测试交易

可以使用 `cast` 命令发送测试交易：

```bash
# 发送 1 ETH 到 MetaMask 账户
cast send <YOUR_METAMASK_ADDRESS> --value 1ether \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://localhost:8545
```

## 常见问题排查

### 问题 1: MetaMask 无法连接到 localhost

**解决方案**：
- 确保 Anvil 使用 `--host 0.0.0.0` 启动
- 检查防火墙设置
- 尝试使用 `127.0.0.1:8545` 而不是 `localhost:8545`

### 问题 2: 连接被拒绝

**检查项**：
```bash
# 1. 确认 Anvil 正在运行
lsof -i :8545

# 2. 测试 RPC 连接
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545
```

### 问题 3: 账户余额为 0

**解决方案**：
- 确认导入的是 Anvil 显示的账户
- 检查是否选择了正确的网络（Chain ID: 31337）
- 可以使用 `cast` 给账户转账：

```bash
# 给 MetaMask 账户转账
cast send <METAMASK_ADDRESS> --value 10ether \
  --private-key <ANVIL_PRIVATE_KEY> \
  --rpc-url http://localhost:8545
```

### 问题 4: 交易失败

**可能原因**：
- 账户余额不足
- Gas 设置问题
- 网络未正确连接

**解决方案**：
- 在 MetaMask 中手动设置 Gas Limit
- 确认网络选择正确
- 检查合约地址是否正确

## 使用场景

### 1. 测试 DApp

```bash
# 启动 Anvil
anvil --host 0.0.0.0 --port 8545

# 部署合约
forge script script/DeployAll.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key <PRIVATE_KEY>

# 在 MetaMask 中连接到 Anvil 网络
# 使用部署的合约地址与 DApp 交互
```

### 2. 多账户测试

```bash
# 启动 Anvil 并创建多个账户
anvil --accounts 20 --host 0.0.0.0

# 导入多个账户到 MetaMask
# 每个账户都有 10000 ETH，可以用于测试
```

### 3. 重置状态

```bash
# 停止 Anvil（Ctrl+C）
# 重新启动 Anvil，状态会重置
anvil --host 0.0.0.0 --port 8545
```

## 安全提示

⚠️ **重要警告**：

1. **不要在生产环境使用测试私钥**
   - Anvil 的私钥仅用于本地开发
   - 永远不要将测试私钥用于主网账户

2. **保护本地网络**
   - 只在开发时使用 `--host 0.0.0.0`
   - 不要在生产服务器上暴露 Anvil

3. **账户管理**
   - 使用测试账户进行开发
   - 不要导入包含真实资金的账户到 Anvil

## 完整示例流程

```bash
# 1. 启动 Anvil
anvil --host 0.0.0.0 --port 8545 --accounts 10

# 2. 在 MetaMask 中添加网络
#    - 网络名称: Anvil Local
#    - RPC URL: http://localhost:8545
#    - Chain ID: 31337
#    - 货币符号: ETH

# 3. 导入账户
#    - 复制 Anvil 输出的私钥
#    - 在 MetaMask 中导入

# 4. 部署合约
forge script script/DeployAll.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# 5. 在 DApp 中使用 MetaMask 连接并交互
```

## 参考资源

- [Foundry Book - Anvil](https://book.getfoundry.sh/anvil/)
- [MetaMask 文档](https://docs.metamask.io/)
- [MetaMask 网络配置](https://docs.metamask.io/guide/connecting-to-a-network.html)



