# AGENTS.md

`@rethunk/dom-input-nav` is keyboard-chord, arrow-focus and gamepad logic for DOM apps. It imports
nothing and takes structural types (`Chord`, `TypingTarget`, `ArrowEvent`, `Rect`), so React,
another framework or a native event all fit. It holds no application's shortcut table.

## Gate

`gate` is the command; each check in `.gate.toml` is a `package.json` script, so a contributor, the
pre-push hook and CI run the same thing. The `build` gate emits `dist` and then checks what `npm pack`
would upload.

## Shape

- Relative imports keep their `.ts` extension; `tsc -p tsconfig.json` rewrites it to `.js` on emit.
- `package.json` `files` is `dist` and `src`: the declaration maps point at `../src`.
- The only entry point is `src/index.ts`; a name not exported there is not API.
- The chord string format (`Ctrl`, `Shift`, `Alt`, `Esc`, `Space`, `Left`, `Right`, arrows as glyphs) is a
  serialization an app may have stored; a change to what `parseKeys` accepts or `formatChord` writes
  breaks stored bindings. The tokens are not wording and are never translated.
- `isTypingTarget` stays a deny-list: a future input type must count as typing, not slip through.
- `typing.ts` has no imports; `arrowFocus` depends on it, never the reverse.
- `matchChord` follows the table's insertion order, which decides which id wins a shared chord.
- Gamepad action names are the standard mapping's (`start`, not an app's verb); the app maps them.

## Files

| File | Holds |
| --- | --- |
| `src/index.ts` | The public surface |
| `src/typing.ts` | `isTypingTarget` and the non-text input list |
| `src/chord.ts` | Chord parse, format and match |
| `src/arrowFocus.ts` | Arrow-key focus over a list of items |
| `src/gamepad.ts` | Standard-mapping gamepad actions and spatial focus |
