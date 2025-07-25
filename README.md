# valext

> Minimal helper for extracting typed, validated values from Valibot schemas.

<br />

Cloudflare Workers, Hono, and other runtime environments benefit from **explicit contracts** and **clear validation flows**.
But `valibot.safeParse()` gives you nested boilerplate, and parsing logic often gets duplicated or abstracted too deeply.

`valext` embraces a simple idea:

### ✨ Extract values with structure and intent, without hiding what matters.

```ts
  const result = extract(schema).from(unknownValue, issues => console.warn(issues))
```

---

## Installation

```bash
  pnpm add @gambonny/valext
```

---

## Why `valext`?

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

