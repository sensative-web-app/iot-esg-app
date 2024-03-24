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

  it("throws SyntaxError when node not found", async () => {
    // Perhaps this should be considered a bug in the implementation;
    // since the function returns undefined for other errors, should
    // it really throw an exception for this case?
    await expect(() => getNodeStats(
      token, "def456", "averageTemperature"))
      .rejects.toThrow(SyntaxError)
  })

  it("throws SyntaxError for bad token", async () => {
    // As for node not found, this probably shouldn't throw SyntaxError.
    await expect(() => getNodeStats(
      "bad-token", "abc123", "averageTemperature"))
      .rejects.toThrow(SyntaxError)
  })
})
