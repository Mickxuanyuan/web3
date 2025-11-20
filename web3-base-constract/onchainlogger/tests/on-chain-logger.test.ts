import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { DataLogged } from "../generated/schema"
import { DataLogged as DataLoggedEvent } from "../generated/OnChainLogger/OnChainLogger"
import { handleDataLogged } from "../src/on-chain-logger"
import { createDataLoggedEvent } from "./on-chain-logger-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let sender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let tag = "Example string value"
    let content = "Example string value"
    let timestamp = BigInt.fromI32(234)
    let newDataLoggedEvent = createDataLoggedEvent(
      sender,
      tag,
      content,
      timestamp
    )
    handleDataLogged(newDataLoggedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("DataLogged created and stored", () => {
    assert.entityCount("DataLogged", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "DataLogged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "sender",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "DataLogged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tag",
      "Example string value"
    )
    assert.fieldEquals(
      "DataLogged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "content",
      "Example string value"
    )
    assert.fieldEquals(
      "DataLogged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timestamp",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
