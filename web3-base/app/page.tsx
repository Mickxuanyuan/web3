"use client";

import { useCallback, useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  JsonRpcProvider,
  TransactionResponse,
  formatEther,
  formatUnits,
} from "ethers";

const FALLBACK_RPC_URL = "https://bsc-mainnet.infura.io/v3/a3c4ce2452824fad9e0af7bbc086bb9f";
const rpcUrl = FALLBACK_RPC_URL
const provider = new JsonRpcProvider(rpcUrl);

export default function Home() {
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [gasPrice, setGasPrice] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState("");
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [txDetails, setTxDetails] = useState<TransactionResponse | null>(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const readChainData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [latestBlockNumber, feeData] = await Promise.all([
        provider.getBlockNumber(),
        provider.getFeeData(),
      ]);

      setBlockNumber(latestBlockNumber);
      if (feeData.gasPrice) {
        setGasPrice(Number(formatUnits(feeData.gasPrice, "gwei")).toFixed(2));
      }
      setLastUpdated(
        new Date().toISOString()
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "链上数据读取失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    readChainData();
  }, [readChainData]);

  const fetchTransaction = useCallback(async () => {
    if (!txHash.trim()) {
      setTxError("请输入交易 hash");
      setTxDetails(null);
      return;
    }

    setTxLoading(true);
    setTxError(null);
    setTxDetails(null);

    try {
      const tx = await provider.getTransaction(txHash.trim());

      if (!tx) {
        setTxError("未查询到交易，请检查 hash");
        return;
      }

      setTxDetails(tx);
    } catch (err) {
      setTxError(err instanceof Error ? err.message : "查询交易失败");
    } finally {
      setTxLoading(false);
    }
  }, [txHash]);

  const fetchBalance = useCallback(async () => {
    if (!address.trim()) {
      setBalanceError("请输入地址");
      setBalance(null);
      return;
    }

    setBalanceLoading(true);
    setBalanceError(null);
    setBalance(null);

    try {
      const result = await provider.getBalance(address.trim());
      setBalance(`${formatEther(result)} BNB`);
    } catch (err) {
      setBalanceError(err instanceof Error ? err.message : "查询余额失败");
    } finally {
      setBalanceLoading(false);
    }
  }, [address]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 p-6">
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

      <section className="rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              链上状态（ethers.js）
            </h2>
            <p className="text-xs text-neutral-500">
              RPC: {rpcUrl.replace(/^https?:\/\//, "")}
            </p>
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
    </main>
  );
}
