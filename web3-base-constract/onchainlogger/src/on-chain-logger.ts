import { DataLogged as DataLoggedEvent } from "../generated/OnChainLogger/OnChainLogger"
import { DataLogged } from "../generated/schema"

export function handleDataLogged(event: DataLoggedEvent): void {
  let entity = new DataLogged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.tag = event.params.tag
  entity.content = event.params.content
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
