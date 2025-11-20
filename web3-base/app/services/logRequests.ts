"use client";

import { request, gql } from "graphql-request";
import { SUBGRAPH_URL } from "@/lib/config";

export type LogEntry = {
  id: string;
  sender: string;
  tag: string;
  content: string;
  timestamp: string;
  blockNumber?: string;
  transactionHash?: string;
};

export const LOG_FETCH_LIMIT = 20;

const LOGS_QUERY = gql`
  query GetDataLoggeds($first: Int!) {
    dataLoggeds(orderBy: timestamp, orderDirection: desc, first: $first) {
      id
      sender
      tag
      content
      timestamp
      blockNumber
      transactionHash
    }
  }
`;

export async function fetchLogs(limit = LOG_FETCH_LIMIT): Promise<LogEntry[]> {
  const data = await request<{ dataLoggeds: LogEntry[] }>(SUBGRAPH_URL, LOGS_QUERY, {
    first: limit,
  });
  return data.dataLoggeds || [];
}
