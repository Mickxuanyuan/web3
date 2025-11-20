import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { DataLogged } from "../generated/OnChainLogger/OnChainLogger"

export function createDataLoggedEvent(
  sender: Address,
  tag: string,
  content: string,
  timestamp: BigInt
): DataLogged {
  let dataLoggedEvent = changetype<DataLogged>(newMockEvent())

  dataLoggedEvent.parameters = new Array()

  dataLoggedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  dataLoggedEvent.parameters.push(
    new ethereum.EventParam("tag", ethereum.Value.fromString(tag))
  )
  dataLoggedEvent.parameters.push(
    new ethereum.EventParam("content", ethereum.Value.fromString(content))
  )
  dataLoggedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return dataLoggedEvent
}
