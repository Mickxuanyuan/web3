"use client";

// 引入 React 钩子与 RainbowKit 连接按钮
import { useCallback, useMemo } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// ethers 负责链上请求与数据格式化
import { Eip1193Provider, JsonRpcProvider, formatEther } from "ethers";
// 自定义 store 钩子封装了所有异步读取与写入逻辑
import {
  formatTimestamp,
  useBalanceLookup,
  useChainData,
  useLogWriter,
  useLogs,
  useTransactionLookup,
} from "@/app/store/useWeb3Store";
import { RPC_URL } from "@/lib/config";
import { useAccount, useWalletClient } from "wagmi";

// 统一封装 window.ethereum 的事件类型，便于在 React 中监听
type EthereumProvider = Eip1193Provider & {
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
};

const fallbackProvider = new JsonRpcProvider(RPC_URL);

export default function Home() {
  const { address: wagmiAddress } = useAccount();
  const { data: wagmiWalletClient } = useWalletClient();

  // RainbowKit/wagmi 的 walletClient 实际是包装后的 window.ethereum
  const walletClient = useMemo<EthereumProvider | null>(() => {
    if (wagmiWalletClient?.transport) {
      const transport = wagmiWalletClient.transport as { value?: unknown };
      if (transport?.value && typeof (transport.value as EthereumProvider).request === "function") {
        return transport.value as EthereumProvider;
      }
      return wagmiWalletClient as unknown as EthereumProvider;
    }

    if (typeof window === "undefined") {
      return null;
    }
    return ((window as typeof window & { ethereum?: EthereumProvider }).ethereum ?? null) as
      | EthereumProvider
      | null;
  }, [wagmiWalletClient]);

  const connectedAddress = wagmiAddress ?? null;

  // 链上基础信息：blockNumber、gasPrice、更新时间
  const {
    blockNumber,
    gasPrice,
    lastUpdated,
    loading,
    error,
    refresh: readChainData,
  } = useChainData(fallbackProvider);

  // 地址余额查询所需状态与方法
  const {
    address,
    setAddress,
    balance,
    balanceLoading,
    balanceError,
    fetchBalance,
  } = useBalanceLookup(fallbackProvider);

  // 交易查询相关输入与结果
  const {
    txHash,
    setTxHash,
    txDetails,
    txLoading,
    txError,
    fetchTransaction,
  } = useTransactionLookup(fallbackProvider);

  // 日志查询逻辑，负责从 The Graph 拉取最新日志
  const { logs, logsLoading, logsError, refresh: refreshLogs } = useLogs();

  // 写日志成功后多等 2 秒再刷新 The Graph，避免区块尚未同步
  const refreshLogsWithDelay = useCallback(() => {
    setTimeout(() => {
      refreshLogs();
    }, 2000);
  }, [refreshLogs]);

  // 写日志区表单状态、错误提示以及提交方法
  const {
    logTag,
    setLogTag,
    logContent,
    setLogContent,
    logLoading,
    logError,
    logSuccess,
    writeLog,
  } = useLogWriter(walletClient, refreshLogsWithDelay);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 p-6">
      {/* 顶部区域：简介与钱包连接按钮 */}
      <section className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            WEB3 Base
          </h1>
          <p className="text-sm text-neutral-500">
            使用 RainbowKit 连接钱包，并通过 ethers.js 读取链上数据。
          </p>
        </div>
        <div className="self-start">
          <ConnectButton />
        </div>
      </section>

      {/* 地址余额查询：输入任意地址后读取 BNB 余额 */}
      <section className="rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          地址余额查询
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          输入地址后使用 ethers.js 获取当前余额。
        </p>

        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="0x..."
            className="flex-1 rounded-xl border border-neutral-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900"
          />
          <button
            type="button"
            onClick={fetchBalance}
            disabled={balanceLoading}
            className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {balanceLoading ? "查询中..." : "查询"}
          </button>
        </div>

        {balanceError && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {balanceError}
          </p>
        )}

        {balance && (
          <p className="mt-3 rounded-lg bg-neutral-100/70 px-3 py-2 text-base font-medium text-neutral-900 dark:bg-neutral-800/70 dark:text-white">
            余额：{balance}
          </p>
        )}
      </section>

      {/* 链上状态：展示区块高度、Gas 与最近更新时间 */}
      <section className="rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              链上状态（ethers.js）
            </h2>
          </div>
          <button
            type="button"
            onClick={readChainData}
            disabled={loading}
            className="rounded-full border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-400/10"
          >
            {loading ? "读取中..." : "刷新"}
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        <dl className="mt-6 space-y-4 text-base">
          <div className="flex items-center justify-between">
            <dt className="text-neutral-500">最新区块高度</dt>
            <dd className="text-lg font-medium text-neutral-900 dark:text-white">
              {blockNumber ?? "—"}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-neutral-500">当前 Gas (Gwei)</dt>
            <dd className="text-lg font-medium text-neutral-900 dark:text-white">
              {gasPrice ? `${gasPrice} Gwei` : "—"}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-neutral-500">更新时间</dt>
            <dd className="text-lg font-medium text-neutral-900 dark:text-white">
              {lastUpdated ?? "—"}
            </dd>
          </div>
        </dl>
      </section>

      {/* 交易查询：根据交易哈希解析基础信息 */}
      <section className="rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          交易查询
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          输入交易 hash，通过 ethers.js 查询详情。
        </p>

        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <input
            value={txHash}
            onChange={(event) => setTxHash(event.target.value)}
            placeholder="0x..."
            className="flex-1 rounded-xl border border-neutral-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900"
          />
          <button
            type="button"
            onClick={fetchTransaction}
            disabled={txLoading}
            className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {txLoading ? "查询中..." : "查询"}
          </button>
        </div>

        {txError && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {txError}
          </p>
        )}

        {txDetails && (
          <dl className="mt-4 space-y-3 text-sm">
            <div className="break-all rounded-lg bg-neutral-100/70 px-3 py-2 dark:bg-neutral-800/70">
              <dt className="text-neutral-500">交易 Hash</dt>
              <dd className="text-neutral-900 dark:text-white">
                {txDetails.hash}
              </dd>
            </div>
            <div className="flex flex-col rounded-lg bg-neutral-100/70 px-3 py-2 dark:bg-neutral-800/70">
              <dt className="text-neutral-500">From</dt>
              <dd className="font-mono text-neutral-900 dark:text-white">
                {txDetails.from}
              </dd>
            </div>
            <div className="flex flex-col rounded-lg bg-neutral-100/70 px-3 py-2 dark:bg-neutral-800/70">
              <dt className="text-neutral-500">To</dt>
              <dd className="font-mono text-neutral-900 dark:text-white">
                {txDetails.to ?? "合约创建"}
              </dd>
            </div>
            <div className="flex flex-col rounded-lg bg-neutral-100/70 px-3 py-2 dark:bg-neutral-800/70">
              <dt className="text-neutral-500">数额</dt>
              <dd className="text-neutral-900 dark:text-white">
                {formatEther(txDetails.value ?? 0n)} BNB
              </dd>
            </div>
            <div className="flex flex-col rounded-lg bg-neutral-100/70 px-3 py-2 dark:bg-neutral-800/70">
              <dt className="text-neutral-500">Block</dt>
              <dd className="text-neutral-900 dark:text-white">
                {txDetails.blockNumber ?? "Pending"}
              </dd>
            </div>
          </dl>
        )}
      </section>

      {/* 写日志：钱包签名调用合约 log 函数 */}
      <section className="rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          写日志（OnChainLogger）
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          连接钱包后，可以调用合约的 log 函数写入链上日志。
        </p>

        {!connectedAddress && (
          <p className="mt-4 rounded-md bg-yellow-50 px-3 py-2 text-sm text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400">
            请先连接钱包
          </p>
        )}

        <div className="mt-4 flex flex-col gap-3">
          <input
            value={logTag}
            onChange={(event) => setLogTag(event.target.value)}
            placeholder="标签（例如：user-action）"
            disabled={!connectedAddress || logLoading}
            className="rounded-xl border border-neutral-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <textarea
            value={logContent}
            onChange={(event) => setLogContent(event.target.value)}
            placeholder="日志内容"
            disabled={!connectedAddress || logLoading}
            rows={4}
            className="rounded-xl border border-neutral-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <button
            type="button"
            onClick={writeLog}
            disabled={!connectedAddress || logLoading || !logTag.trim() || !logContent.trim()}
            className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {logLoading ? "写入中..." : "写入日志"}
          </button>
        </div>

        {logError && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {logError}
          </p>
        )}

        {logSuccess && (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-600 dark:bg-green-500/10 dark:text-green-400">
            {logSuccess}
          </p>
        )}
      </section>

      {/* 日志列表：通过 The Graph 查询最近 20 条记录 */}
      <section className="rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              日志列表（The Graph）
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              通过 The Graph 查询链上日志数据。
            </p>
          </div>
          <button
            type="button"
            onClick={refreshLogs}
            disabled={logsLoading}
            className="rounded-full border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-400/10"
          >
            {logsLoading ? "加载中..." : "刷新"}
          </button>
        </div>

        {logsError && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {logsError}
          </p>
        )}

        {logsLoading && logs.length === 0 && (
          <p className="mt-4 text-center text-sm text-neutral-500">
            加载中...
          </p>
        )}

        {!logsLoading && logs.length === 0 && !logsError && (
          <p className="mt-4 text-center text-sm text-neutral-500">
            暂无日志数据
          </p>
        )}

        {logs.length > 0 && (
          <div className="mt-4 space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-lg border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-700 dark:bg-neutral-800/70"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                        {log.tag}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-900 dark:text-white">
                      {log.content}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-neutral-500">
                      <span>发送者: <span className="font-mono">{log.sender}</span></span>
                      <span>时间: {formatTimestamp(log.timestamp)}</span>
                      {log.transactionHash && (
                        <span className="break-all">
                          Tx: <span className="font-mono">{log.transactionHash}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
