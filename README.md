<h1 align="center">dom-input-nav</h1>

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@rethunk/dom-input-nav.svg)](https://www.npmjs.com/package/@rethunk/dom-input-nav)
[![TypeScript](https://img.shields.io/badge/TypeScript-typed-3178C6?logo=typescript&logoColor=white)](tsconfig.json)

</div>

---

Keyboard chords, arrow-key grid focus and standard-mapping gamepad input for DOM apps, with no framework import. Package `@rethunk/dom-input-nav`. First consumer: Mortar.

It imports nothing, React included: every function takes plain objects, so a framework's event or a native one
fits. Chords are stored as short strings such as `Ctrl+Shift+F`, so an app can let people rebind them.
Cmd and Meta read as Ctrl, so `Ctrl+K` also fires on Cmd+K and no chord tells the two apart.

```ts
matchChord(event, { palette: 'Ctrl+K', play: 'Ctrl+P' }) // 'palette' | 'play' | null
```

## Quick start

```bash
bun add @rethunk/dom-input-nav
```

A worked example and the contracts: [HUMANS.md](HUMANS.md).

## Features

- `parseKeys`, `formatChord` and `matchChord` turn key events into a stored chord string and match them against a table.
- `isTypingTarget` tells a text field from a checkbox, so shortcuts stay quiet only while typing.
- `arrowFocus` and `nextIndex` walk a grid or row of items with the arrow keys.
- `heldActions`, `firedActions` and `heldElsewhere` turn standard-mapping gamepad state into actions with key repeat.
- `spatialNext` picks the control nearest in a direction, for controller focus.

## Documentation

| Doc | Audience |
| --- | --- |
| [HUMANS.md](HUMANS.md) | Running and using the package |
| [AGENTS.md](AGENTS.md) | Internals, invariants, and why |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Process — commits, tests, docs |
| [SECURITY.md](SECURITY.md) | Vulnerability disclosure |
| [CHANGELOG.md](CHANGELOG.md) | Release notes |

## License

MIT — see [LICENSE](LICENSE). © 2026 Rethunk.Tech, LLC.
