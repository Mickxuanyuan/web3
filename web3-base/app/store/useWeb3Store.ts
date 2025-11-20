"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BrowserProvider,
  Eip1193Provider,
  JsonRpcProvider,
  TransactionResponse,
  formatEther,
  formatUnits,
} from "ethers";
import { fetchLogs as fetchLogsRequest, LOG_FETCH_LIMIT, LogEntry } from "@/app/services/logRequests";
import { getContract } from "@/lib/contract";

export function formatTimestamp(timestamp: string) {
  const numericTimestamp = Number(timestamp);
  if (!Number.isFinite(numericTimestamp)) {
    return "未知";
  }
  return new Date(numericTimestamp * 1000).toLocaleString();
}

export function useChainData(provider: JsonRpcProvider) {
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [gasPrice, setGasPrice] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
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
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "链上数据读取失败");
    } finally {
      setLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    blockNumber,
    gasPrice,
    lastUpdated,
    loading,
    error,
    refresh,
  };
}

export function useBalanceLookup(provider: JsonRpcProvider) {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!address.trim()) {
      setError("请输入地址");
      setBalance(null);
      return;
    }

    setLoading(true);
    setError(null);
    setBalance(null);

    try {
      const result = await provider.getBalance(address.trim());
      setBalance(`${formatEther(result)} BNB`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "查询余额失败");
    } finally {
      setLoading(false);
    }
  }, [address, provider]);

  return {
    address,
    setAddress,
    balance,
    balanceLoading: loading,
    balanceError: error,
    fetchBalance,
  };
}

export function useTransactionLookup(provider: JsonRpcProvider) {
  const [txHash, setTxHash] = useState("");
  const [txDetails, setTxDetails] = useState<TransactionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransaction = useCallback(async () => {
    if (!txHash.trim()) {
      setError("请输入交易 hash");
      setTxDetails(null);
      return;
    }

    setLoading(true);
    setError(null);
    setTxDetails(null);

    try {
      const tx = await provider.getTransaction(txHash.trim());
      if (!tx) {
        setError("未查询到交易，请检查 hash");
        return;
      }
      setTxDetails(tx);
    } catch (err) {
      setError(err instanceof Error ? err.message : "查询交易失败");
    } finally {
      setLoading(false);
    }
  }, [provider, txHash]);

  return {
    txHash,
    setTxHash,
    txDetails,
    txLoading: loading,
    txError: error,
    fetchTransaction,
  };
}

export function useLogs(limit = LOG_FETCH_LIMIT) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLogsRequest(limit);
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "读取日志失败");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    logs,
    logsLoading: loading,
    logsError: error,
    refresh,
  };
}

export function useLogWriter(
  walletClient: Eip1193Provider | null | undefined,
  afterSuccess?: () => void,
) {
  const [logTag, setLogTag] = useState("");
  const [logContent, setLogContent] = useState("");
  const [logLoading, setLogLoading] = useState(false);
  const [logError, setLogError] = useState<string | null>(null);
  const [logSuccess, setLogSuccess] = useState<string | null>(null);

  const writeLog = useCallback(async () => {
    const trimmedTag = logTag.trim();
    const trimmedContent = logContent.trim();
    if (!trimmedTag || !trimmedContent) {
      setLogError("请输入标签和内容");
      return;
    }

    if (!walletClient) {
      setLogError("请先连接钱包");
      return;
    }

    setLogLoading(true);
    setLogError(null);
    setLogSuccess(null);

    try {
      const signer = await new BrowserProvider(walletClient).getSigner();
      const contract = getContract(signer);
      const tx = await contract.log(trimmedTag, trimmedContent);
      await tx.wait();
      setLogSuccess(`日志已成功写入！交易 Hash: ${tx.hash}`);
      setLogTag("");
      setLogContent("");
      afterSuccess?.();
    } catch (err) {
      setLogError(err instanceof Error ? err.message : "写入日志失败");
    } finally {
      setLogLoading(false);
    }
  }, [afterSuccess, logContent, logTag, walletClient]);

  return {
    logTag,
    setLogTag,
    logContent,
    setLogContent,
    logLoading,
    logError,
    logSuccess,
    writeLog,
  };
}
