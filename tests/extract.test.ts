import { describe, it, expect, vi } from "vitest"
import * as v from "valibot"
import { extract } from "../src/extract"

const userSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email()),
  age: v.number(),
})

describe("extract()", () => {
  const validInput = {
    email: " test@example.com ",
    age: 30,
  }

  const invalidInput = {
    email: "invalid-email",
    age: "not-a-number",
  }

  describe(".from()", () => {
    it("returns success = true with parsed output", () => {
      const result = extract(userSchema).from(validInput)
      expect(result.success).toBe(true)
      expect(result.output).toEqual({
        email: "test@example.com",
        age: 30,
      })
    })

    it("returns success = false with issues", () => {
      const result = extract(userSchema).from(invalidInput)
      expect(result.success).toBe(false)
      expect(result.issues).toBeDefined()
      expect(result.output).toBeUndefined()
    })

    it("calls onValidationError with flattened issues", () => {
      const spy = vi.fn()
      extract(userSchema).from(invalidInput, spy)
      expect(spy).toHaveBeenCalledOnce()
      expect(spy.mock.calls[0][0]).toMatchObject({
        email: expect.any(Array),
        age: expect.any(Array),
      })
    })
  })

  describe(".safe()", () => {
    it("returns success = true for valid input", () => {
      const result = extract(userSchema).safe(validInput)
      expect(result.success).toBe(true)
    })

    it("returns success = false and calls onValidationError", () => {
      const spy = vi.fn()
      const result = extract(userSchema).safe(invalidInput, spy)
      expect(result.success).toBe(false)
      expect(spy).toHaveBeenCalledOnce()
    })
  })

  describe(".parse()", () => {
    it("parses valid input and returns output", () => {
      const output = extract(userSchema).parse(validInput)
      expect(output).toEqual({
        email: "test@example.com",
        age: 30,
      })
    })

    it("throws error for invalid input", () => {
      expect(() => {
        extract(userSchema).parse(invalidInput)
      }).toThrow()
    })
  })
})
