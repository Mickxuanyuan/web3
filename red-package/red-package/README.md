# 链上抢红包前端

功能：
- 顶部钱包组件：连接/切换钱包、展示地址或 ENS、快速切换 Sepolia。
- 发红包：金额 ETH 等分给指定份数，可设置有效期和祝福语。
- 抢红包：输入红包 ID 即可抢，事件提示“红包抢完了 / 你已经抢过了 / 过期”。
- 事件流：链上事件实时提示，便于前端反馈。

## 启动
```bash
pnpm install
pnpm dev
```
在 `.env.local` 中配置已部署的合约地址：
```bash
NEXT_PUBLIC_RED_PACKET_ADDRESS=0xYourDeployedAddress
```

## 合约与部署
- 合约源码：`../red-package-constract/src/redPackage.sol`
- Foundry 部署脚本：`../red-package-constract/script/RedPacket.s.sol:RedPacketScript`
示例（Sepolia）：
```bash
cd ../red-package-constract
forge script script/RedPacket.s.sol:RedPacketScript \
  --rpc-url <sepolia_rpc> --broadcast \
  --private-key <deployer_private_key>
```
部署后将地址填入前端环境变量，重启 dev 服务。

## 事件说明（前端监听）
- `RedPacketCreated(packetId, creator, totalAmount, totalShares, expiresAt, note)`
- `RedPacketClaimed(packetId, claimer, amount, remainingShares)`
- `ClaimFailed(packetId, claimer, reason)` reason: `ALREADY_CLAIMED | EMPTY | EXPIRED`
- `RedPacketExhausted(packetId)`
- `Refunded(packetId, to, amount)`

前端已订阅事件：成功 claim、红包抢空、重复领取、过期等都会通过 toast + 事件流提示。
