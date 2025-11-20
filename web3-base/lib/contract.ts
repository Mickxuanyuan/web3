import { ethers, Signer } from "ethers";
import { CONTRACT_ADDRESS, RPC_URL } from "./config";
import ABI from "../abi/OnChainLogger.json";

export const provider = new ethers.JsonRpcProvider(RPC_URL);

export const getContract = (signer?: Signer) =>
  new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
