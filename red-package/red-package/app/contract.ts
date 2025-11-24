export const RED_PACKET_ADDRESS =
  process.env.NEXT_PUBLIC_RED_PACKET_ADDRESS ||
  "0x0000000000000000000000000000000000000000"; // replace after deploy

export const TARGET_CHAIN_ID = 11155111; // Sepolia
export const TARGET_CHAIN_NAME = "Sepolia";

// Minimal ABI covering everything used by the UI.
export const RED_PACKET_ABI = [
  {
    type: "function",
    name: "createRedPacket",
    stateMutability: "payable",
    inputs: [
      { name: "totalShares", type: "uint256" },
      { name: "durationInSeconds", type: "uint64" },
      { name: "note", type: "string" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "claim",
    stateMutability: "nonpayable",
    inputs: [{ name: "packetId", type: "uint256" }],
    outputs: [{ name: "claimed", type: "uint256" }],
  },
  {
    type: "function",
    name: "refund",
    stateMutability: "nonpayable",
    inputs: [
      { name: "packetId", type: "uint256" },
      { name: "to", type: "address" },
    ],
    outputs: [{ name: "amount", type: "uint256" }],
  },
  {
    type: "function",
    name: "packetInfo",
    stateMutability: "view",
    inputs: [{ name: "packetId", type: "uint256" }],
    outputs: [
      { name: "creator", type: "address" },
      { name: "totalAmount", type: "uint256" },
      { name: "remainingAmount", type: "uint256" },
      { name: "totalShares", type: "uint256" },
      { name: "remainingShares", type: "uint256" },
      { name: "createdAt", type: "uint64" },
      { name: "expiresAt", type: "uint64" },
      { name: "note", type: "string" },
    ],
  },
  {
    type: "function",
    name: "hasClaimed",
    stateMutability: "view",
    inputs: [
      { name: "packetId", type: "uint256" },
      { name: "user", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "RedPacketCreated",
    inputs: [
      { name: "packetId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "totalAmount", type: "uint256", indexed: false },
      { name: "totalShares", type: "uint256", indexed: false },
      { name: "expiresAt", type: "uint64", indexed: false },
      { name: "note", type: "string", indexed: false },
    ],
  },
  {
    type: "event",
    name: "RedPacketClaimed",
    inputs: [
      { name: "packetId", type: "uint256", indexed: true },
      { name: "claimer", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "remainingShares", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "RedPacketExhausted",
    inputs: [{ name: "packetId", type: "uint256", indexed: true }],
  },
  {
    type: "event",
    name: "ClaimFailed",
    inputs: [
      { name: "packetId", type: "uint256", indexed: true },
      { name: "claimer", type: "address", indexed: true },
      { name: "reason", type: "string", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Refunded",
    inputs: [
      { name: "packetId", type: "uint256", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const;
