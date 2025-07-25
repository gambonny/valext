import * as v from "valibot"

// Base schema type used across all extract functions
type TypedSchema = v.BaseSchema<any, any, v.BaseIssue<unknown>>

// Optional error handler used when validation fails
export type OnValidationError = (
  issues: ReturnType<typeof v.flatten>["nested"],
) => void

// Unified result shape for `from()` method
export type ExtractResult<TSchema extends TypedSchema> =
  | { success: true; output: v.InferOutput<TSchema>; issues: undefined }
  | {
      success: false
      output: undefined
      issues: ReturnType<typeof v.flatten>["nested"]
    }

// Factory function to wrap Valibot schema with safe utilities
export function extract<TSchema extends TypedSchema>(schema: TSchema) {
  return {
    // Runs safeParse() and returns a normalized result shape
    from(
      input: unknown,
      onValidationError?: OnValidationError,
    ): ExtractResult<TSchema> {
      const result = v.safeParse(schema, input)

      if (result.success) {
        return { success: true, output: result.output, issues: undefined }
      }

      // Flatten issues for cleaner consumption
      const flattened = v.flatten(result.issues).nested
      onValidationError?.(flattened)

      return {
        success: false,
        output: undefined,
        issues: flattened,
      }
    },

    // Same as Valibot's safeParse, but optionally hooks into error handling
    safe(
      input: unknown,
      onValidationError?: OnValidationError,
    ): ReturnType<typeof v.safeParse> {
      const result = v.safeParse(schema, input)

      if (!result.success) {
        onValidationError?.(v.flatten(result.issues).nested)
      }

      return result
    },

    // Raw parse that throws on failure — same as Valibot’s parse
    parse(input: unknown): v.InferOutput<TSchema> {
      return v.parse(schema, input)
    },
  }
}
