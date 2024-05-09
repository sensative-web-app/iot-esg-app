import { describe, it, expect } from "vitest"
import { getNodeStats } from "../src/actions"

const token = "valid-token"

describe("getNodeStats", () => {
  it("returns decoded JSON for valid request", async () => {
    const nodeId = "abc123"
    const result = await getNodeStats(token, nodeId, "averageTemperature")
    const expected = [
      {
        "mean": 22.5,
        "time": "2024-03-14T14:06:44.896Z",
        "value": 22.5,
      },
      {
        "mean": 22.4,
        "time": "2024-03-14T13:51:44.974Z",
        "value": 22.4,
      },
    ]
    expect(result).toEqual(expected);
  })

  it("returns undefined when node not found", async () => {
    const result = await getNodeStats(token, "def456", "averageTemperature")
    expect(result).toBeUndefined()
  })

  it("returns undefined for bad token", async () => {
    const result = await getNodeStats("bad-token", "abc123", "averageTemperature")
    expect(result).toBeUndefined()
  })
})
