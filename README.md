# valext

> Minimal helper for extracting typed, validated values from Valibot schemas.

<br />

`valibot.safeParse()` works — but it’s not very intuitive.  
It leads to very procedural code, where you manually handle control flow and flatten errors — a common task when logging structural data for observability.
It reads like plumbing — not like intent.

```ts
...
import { safeParse, flatten } from 'valibot'

const result = safeParse(schema, input)

if (!result.success) {
  const issues = flatten(result.issues).nested
  logger.warn('validation failed', { issues })
}
```

This boilerplate is everywhere, and it hides your intent behind ceremony.

`valext` introduces a small shift:

### ✨ Extract values fluently — and express what you mean.
```ts
...
import { extract } from '@gambonny/valext'

const result = extract(schema).from(input, issues => {
  logger.warn('validation failed', { issues })
})
```

- ✅ Reads like a sentence: `extract(...).from(...)`
- ✅ Logs **flattened** issues automatically via callback
- ✅ Makes routes easier to scan, reason about, and debug

---

## Installation

```bash
  pnpm add @gambonny/valext
```

---

## Example in Hono

```ts
import { validator } from 'hono/validator'
import { extract } from '@gambonny/valext'
import { signupSchema } from './schemas'

app.post(
  '/signup',
  validator('json', async (body, c) => {
    const { success, output } = extract(signupSchema).from(body, issues =>
      c.var.logger.warn('validation failed', { issues }),
    )

    return success ? output : c.text('Invalid input')
  }),
)
```

---

## API

### `extract(schema).from(input, onError?)`

Returns:

```ts
{
  success: true;
  output: T;
  issues: undefined;
}
```

or:

```ts
{
  success: false;
  output: undefined;
  issues: ValibotFlattenedIssues;
}
```

---

### `extract(schema).safe(input, onError?)`

Exactly like `valibot.safeParse()`, but lets you pass a callback for flattened errors.

---

### `extract(schema).parse(input)`

Exactly like `valibot.parse()`. Will throw if input is invalid.

---

## Design Notes

- ✅ `valext` uses `valibot.safeParse()` under the hood.
- ✅ Errors are **flattened** with `valibot.flatten().nested` for easy rendering/logging.
- ✅ If you need raw nested issues, just use `valibot.safeParse()` directly —  you’re not locked in.

> **Reminder:** `valext` is not an abstraction layer —  it’s a tool for making your intent clear at the point of use.

---

## License

[MIT](./LICENSE)

