"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";
import {
  RED_PACKET_ABI,
  RED_PACKET_ADDRESS,
  TARGET_CHAIN_ID,
  TARGET_CHAIN_NAME,
} from "./contract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

type Toast = { id: string; text: string; tone: "info" | "success" | "warn" | "error" };
type Activity = { id: string; title: string; detail?: string };

const chainHex = `0x${TARGET_CHAIN_ID.toString(16)}`;

const shorten = (addr: string) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(addr.length - 4)}` : "";

const randomId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function Home() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const [account, setAccount] = useState<string>("");
  const [ensName, setEnsName] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [sending, setSending] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [lastCreated, setLastCreated] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [sendForm, setSendForm] = useState({
    amount: "0.05",
    shares: 5,
    durationHours: 24,
    note: "新年快乐！",
  });
  const [claimForm, setClaimForm] = useState({ packetId: "" });

  const reader = useMemo(() => {
    if (!provider) return null;
    return new Contract(RED_PACKET_ADDRESS, RED_PACKET_ABI, provider);
  }, [provider]);

  const writer = useMemo(() => {
    if (!provider || !account) return null;
    return new Contract(RED_PACKET_ADDRESS, RED_PACKET_ABI, signer ?? provider);
  }, [provider, signer, account]);

  const addToast = (text: string, tone: Toast["tone"] = "info") => {
    const id = randomId();
    setToasts((prev) => [...prev, { id, text, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  const addActivity = (title: string, detail?: string) => {
    const id = randomId();
    setActivity((prev) => [{ id, title, detail }, ...prev].slice(0, 8));
  };

  const hydrateProvider = async () => {
    if (!window.ethereum) return;
    const browserProvider = new BrowserProvider(window.ethereum);
    setProvider(browserProvider);
    const net = await browserProvider.getNetwork();
    setChainId(Number(net.chainId));
    const accounts = await browserProvider.send("eth_accounts", []);
    if (accounts && accounts[0]) {
      await afterConnect(browserProvider, accounts[0]);
    }
  };

  const afterConnect = async (browserProvider: BrowserProvider, addr: string) => {
    setAccount(addr);
    const signerInstance = await browserProvider.getSigner();
    setSigner(signerInstance);
    try {
      const name = await browserProvider.lookupAddress(addr);
      setEnsName(name);
    } catch {
      setEnsName(null);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      addToast("请先安装/解锁 MetaMask 或钱包插件", "warn");
      return;
    }
    setConnecting(true);
    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      setProvider(browserProvider);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      const net = await browserProvider.getNetwork();
      setChainId(Number(net.chainId));
      await afterConnect(browserProvider, accounts[0]);
      addToast("钱包已连接", "success");
    } catch (err: any) {
      addToast(err?.message || "连接失败", "error");
    } finally {
      setConnecting(false);
    }
  };

  const ensureNetwork = async () => {
    if (!window.ethereum || !provider) return;
    const net = await provider.getNetwork();
    const currentId = Number(net.chainId);
    setChainId(currentId);
    if (currentId === TARGET_CHAIN_ID) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainHex }],
      });
      addToast(`已切换到 ${TARGET_CHAIN_NAME}`, "success");
      setChainId(TARGET_CHAIN_ID);
    } catch (err: any) {
      if (err?.code === 4902) {
        addToast("请先在钱包里添加 Sepolia 网络", "warn");
      } else {
        addToast("切换网络失败", "error");
      }
      throw err;
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!writer) {
      addToast("请先连接钱包", "warn");
      return;
    }
    await ensureNetwork();
    try {
      setSending(true);
      const value = parseEther(sendForm.amount || "0");
      const duration = Math.max(0, Math.floor(Number(sendForm.durationHours) * 3600));
      const tx = await writer.createRedPacket(
        Number(sendForm.shares),
        duration,
        sendForm.note,
        { value }
      );
      addActivity("红包创建中...", `交易 ${tx.hash.slice(0, 10)}...`);
      const receipt = await tx.wait();
      const parsed = receipt?.logs
        ?.map((log: any) => {
          try {
            return writer.interface.parseLog({ topics: log.topics, data: log.data });
          } catch {
            return null;
          }
        })
        .find((log: any) => log && log.name === "RedPacketCreated");
      const packetId = parsed?.args?.packetId?.toString?.();
      if (packetId) {
        setLastCreated(packetId);
        addActivity("红包已上链", `ID #${packetId}, 金额 ${sendForm.amount} ETH`);
        addToast(`红包创建成功 (#${packetId})`, "success");
      } else {
        addToast("红包创建完成，未能解析事件", "warn");
      }
    } catch (err: any) {
      addToast(err?.shortMessage || err?.message || "创建失败", "error");
    } finally {
      setSending(false);
    }
  };

  const handleClaim = async (e: FormEvent) => {
    e.preventDefault();
    if (!writer) {
      addToast("请先连接钱包", "warn");
      return;
    }
    if (!claimForm.packetId) {
      addToast("请输入红包 ID", "warn");
      return;
    }
    await ensureNetwork();
    try {
      setClaiming(true);
      const tx = await writer.claim(BigInt(claimForm.packetId));
      addActivity("抢红包中...", `交易 ${tx.hash.slice(0, 10)}...`);
      const receipt = await tx.wait();
      const parsed = receipt?.logs
        ?.map((log: any) => {
          try {
            return writer.interface.parseLog({ topics: log.topics, data: log.data });
          } catch {
            return null;
          }
        })
        .find((log: any) => log && log.name === "RedPacketClaimed");
      if (parsed?.args) {
        const amount = formatEther(parsed.args.amount);
        addToast(`抢到 ${amount} ETH!`, "success");
        addActivity("抢红包成功", `拿到 ${amount} ETH #${parsed.args.packetId}`);
      } else {
        addToast("交易完成，可查看事件流", "info");
      }
    } catch (err: any) {
      addToast(err?.shortMessage || err?.message || "抢红包失败", "error");
    } finally {
      setClaiming(false);
    }
  };

  useEffect(() => {
    hydrateProvider();
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    const onAccounts = (accounts: string[]) => {
      if (!accounts.length) {
        setAccount("");
        setSigner(null);
        setEnsName(null);
        return;
      }
      if (provider) {
        afterConnect(provider, accounts[0]);
      }
    };
    const onChain = (hexId: string) => setChainId(parseInt(hexId, 16));

    window.ethereum.on?.("accountsChanged", onAccounts);
    window.ethereum.on?.("chainChanged", onChain);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", onAccounts);
      window.ethereum?.removeListener?.("chainChanged", onChain);
    };
  }, [provider]);

  useEffect(() => {
    if (!reader) return;
    const onCreated = (
      packetId: bigint,
      creator: string,
      totalAmount: bigint,
      totalShares: bigint,
      expiresAt: bigint,
      note: string
    ) => {
      addActivity(
        "新红包上线",
        `#${packetId.toString()} ${formatEther(totalAmount)} ETH / ${totalShares.toString()} 份`
      );
      if (creator.toLowerCase() === account?.toLowerCase()) {
        setLastCreated(packetId.toString());
      }
    };
    const onClaimed = (
      packetId: bigint,
      claimer: string,
      amount: bigint,
      remainingShares: bigint
    ) => {
      addActivity(
        "有人抢到红包",
        `#${packetId.toString()} ${formatEther(amount)} ETH 剩余 ${remainingShares.toString()} 份`
      );
      if (claimer.toLowerCase() === account?.toLowerCase()) {
        addToast(`你抢到 ${formatEther(amount)} ETH`, "success");
      }
    };
    const onFail = (packetId: bigint, claimer: string, reason: string) => {
      let text = reason;
      if (reason === "ALREADY_CLAIMED") text = "你已经抢过了";
      if (reason === "EMPTY") text = "红包抢完了";
      if (reason === "EXPIRED") text = "红包已过期";
      if (claimer.toLowerCase() === account?.toLowerCase()) {
        addToast(text, "warn");
      }
      addActivity("抢红包失败", `#${packetId.toString()} ${text}`);
    };
    const onExhausted = (packetId: bigint) => {
      addActivity("红包被抢完", `#${packetId.toString()}`);
    };

    reader.on("RedPacketCreated", onCreated);
    reader.on("RedPacketClaimed", onClaimed);
    reader.on("ClaimFailed", onFail);
    reader.on("RedPacketExhausted", onExhausted);

    return () => {
      reader.removeAllListeners("RedPacketCreated");
      reader.removeAllListeners("RedPacketClaimed");
      reader.removeAllListeners("ClaimFailed");
      reader.removeAllListeners("RedPacketExhausted");
    };
  }, [reader, account]);

  const connectedLabel = ensName || (account ? shorten(account) : "未连接");
  const chainWarning = chainId && chainId !== TARGET_CHAIN_ID;
  const missingAddress =
    RED_PACKET_ADDRESS === "0x0000000000000000000000000000000000000000";

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">
          <span className="brand-mark">RP</span>
          <div>
            <div className="brand-title">链上红包</div>
            <div className="brand-subtitle">Red package for friends & communities</div>
          </div>
        </div>
        <div className="wallet">
          <div className="wallet-row">
            <span className="badge">{TARGET_CHAIN_NAME}</span>
            <span className="address">{connectedLabel}</span>
          </div>
          <div className="wallet-actions">
            <button className="ghost" onClick={ensureNetwork}>
              切换网络
            </button>
            <button className="primary" onClick={connectWallet} disabled={connecting}>
              {account ? "切换/刷新钱包" : connecting ? "连接中..." : "连接钱包"}
            </button>
          </div>
        </div>
      </div>

      {chainWarning && (
        <div className="banner warn">
          当前网络不是 {TARGET_CHAIN_NAME}，请点击“切换网络”或在钱包手动切换。
        </div>
      )}
      {missingAddress && (
        <div className="banner warn">
          前端未配置合约地址，请在 .env.local 中设置 NEXT_PUBLIC_RED_PACKET_ADDRESS 后重启。
        </div>
      )}

      <div className="layout">
        <section className="card highlight">
          <div className="card-header">
            <div>
              <p className="eyebrow">CREATE</p>
              <h2>发一个链上红包</h2>
              <p className="muted">
                金额等分发送。事件会告诉前端是否抢完、是否已经抢过。
              </p>
            </div>
            {lastCreated && <span className="pill">上次创建 ID #{lastCreated}</span>}
          </div>
          <form className="form" onSubmit={handleCreate}>
            <div className="form-grid">
              <label className="field">
                <span>总金额 (ETH)</span>
                <input
                  type="number"
                  step="0.001"
                  min="0.0001"
                  required
                  value={sendForm.amount}
                  onChange={(e) => setSendForm((f) => ({ ...f, amount: e.target.value }))}
                />
              </label>
              <label className="field">
                <span>份数 (人数)</span>
                <input
                  type="number"
                  min="1"
                  required
                  value={sendForm.shares}
                  onChange={(e) =>
                    setSendForm((f) => ({ ...f, shares: Number(e.target.value) }))
                  }
                />
              </label>
              <label className="field">
                <span>有效期 (小时)</span>
                <input
                  type="number"
                  min="0"
                  value={sendForm.durationHours}
                  onChange={(e) =>
                    setSendForm((f) => ({ ...f, durationHours: Number(e.target.value) }))
                  }
                />
              </label>
            </div>
            <label className="field">
              <span>祝福语 / 备注</span>
              <input
                type="text"
                maxLength={120}
                value={sendForm.note}
                onChange={(e) => setSendForm((f) => ({ ...f, note: e.target.value }))}
              />
            </label>
            <button className="primary wide" type="submit" disabled={sending}>
              {sending ? "提交中..." : "发出红包"}
            </button>
          </form>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <p className="eyebrow">CLAIM</p>
              <h3>我来抢红包</h3>
              <p className="muted">输入红包 ID，前端会监听事件提示是否抢完或重复。</p>
            </div>
          </div>
          <form className="form" onSubmit={handleClaim}>
            <label className="field">
              <span>红包 ID</span>
              <input
                type="number"
                min="1"
                required
                value={claimForm.packetId}
                onChange={(e) => setClaimForm({ packetId: e.target.value })}
              />
            </label>
            <button className="secondary wide" type="submit" disabled={claiming}>
              {claiming ? "抢红包中..." : "立即抢"}
            </button>
          </form>
          <div className="helper">
            - 如果已抢过/被抢完/过期，合约会触发 ClaimFailed 事件，前端直接展示提示。<br />
            - 过期红包由创建者调用 refund 取回余额。
          </div>
        </section>

        <section className="card feed">
          <div className="card-header">
            <div>
              <p className="eyebrow">LIVE FEED</p>
              <h3>事件流 (链上事件驱动提示)</h3>
            </div>
          </div>
          {activity.length === 0 ? (
            <p className="muted">等待事件中... 发红包或抢红包查看实时提示。</p>
          ) : (
            <ul className="activity">
              {activity.map((item) => (
                <li key={item.id}>
                  <div className="activity-title">{item.title}</div>
                  {item.detail && <div className="activity-detail">{item.detail}</div>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="toasts">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.tone}`}>
            {toast.text}
          </div>
        ))}
      </div>
    </div>
  );
}
