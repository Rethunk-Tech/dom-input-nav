# HUMANS.md

Run and use `dom-input-nav`. Internals: [AGENTS.md](AGENTS.md).

## Quick start

```bash
bun add @rethunk/dom-input-nav
```

```ts
import { arrowFocus, formatChord, isTypingTarget, matchChord } from '@rethunk/dom-input-nav'

const bindings = { palette: 'Ctrl+K', filter: 'Ctrl+F' }

window.addEventListener('keydown', (e) => {
  if (isTypingTarget(e.target instanceof HTMLElement ? e.target : null)) {
    return
  }
  const id = matchChord(e, bindings)
  if (id) {
    e.preventDefault()
    console.log(id, formatChord(e))
  }
})

const grid = document.querySelector<HTMLElement>('#grid')
grid?.addEventListener('keydown', (e) => arrowFocus(e, '.card'))
```

## Contracts

| Entry point                                           | Contract                                                                                                                                                                                                                                                               |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `parseKeys(keys)`                                     | `"Ctrl+Shift+F"` to a `Chord`; `null` when no key is named. A trailing `+` is the plus key.                                                                                                                                                                            |
| `formatChord(e)`                                      | A key event to its chord string; `null` for a lone modifier press.                                                                                                                                                                                                     |
| `matchChord(e, bindings)`                             | The first id, in the table's insertion order, whose chord equals `e`; `null` for none. An empty chord matches nothing.                                                                                                                                                 |
| Meta and Ctrl                                         | Folded into one: `Cmd`, `Meta` and `Ctrl` all parse to `ctrlKey`, and matching compares `ctrlKey \|\| metaKey`. An app that needs them distinct does not use this grammar.                                                                                             |
| `isTypingTarget(el)`                                  | `true` for text-like inputs, `textarea`, `select` and content-editable elements; an unknown input type counts as typing. `{ ancestors: true }` also counts an element with a typing target above it.                                                                   |
| `typeaheadChar(e)`                                    | The letter or digit of a key event with no Ctrl, Alt or Meta, or `undefined` when it is another key or `e.target` is a typing target.                                                                                                                                  |
| `typedKey(name)` / `typedMatch(items, typed, nameOf)` | `typedKey` keeps letters and digits, lower case, accents dropped. `typedMatch` is the first item whose key starts with the typed text, else the first that holds it. `TYPE_RESET_MS` is the pause after which typing starts a new search; the caller keeps the buffer. |
| `arrowFocus(e, items, pick?)`                         | Moves focus among `items` inside `e.currentTarget`, preventing the default only when focus moves. It does nothing for a typing target or an event already prevented.                                                                                                   |
| `nextIndex(rects, at, key)`                           | The item an arrow key moves to; `-1` means stay.                                                                                                                                                                                                                       |
| `heldActions(pads)`                                   | The actions held on every pad, the left stick read as the d-pad at half deflection.                                                                                                                                                                                    |
| `firedActions(held, due, now)`                        | Each action once as it is pressed; a held direction again after a pause, then at a steady rate. `due` is state the caller keeps.                                                                                                                                       |
| `heldElsewhere(held, due)`                            | Marks held actions as fired, so a press made while another window had the pad does nothing on return.                                                                                                                                                                  |
| `spatialNext(from, rects, dir, skip?)`                | The index of the nearest rect that lies in the direction; `-1` for none.                                                                                                                                                                                               |

## Requirements

ES modules, read by a bundler or a runtime such as Bun or Node. Developing the package takes `bun`, plus `lefthook`, `gitleaks` and `gate` on PATH if
you want the git hooks.

```bash
bun install
lefthook install
```

That is per clone; git does not commit hooks. Pre-commit scans staged changes for secrets, and
pre-push runs `gate`.

## Verify

```bash
gate
```
