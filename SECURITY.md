# Security

## Supported versions

The latest tagged release. There are no long-lived release branches, so a fix ships in the next tag
rather than being backported.

## Reporting a vulnerability

Use GitHub's **private vulnerability reporting** on this repository (Security → Report a
vulnerability). It stays private until a fix ships.

Please do not open a public issue for a suspected vulnerability first.

## What is in scope

- `parseKeys` reads chord strings an application may load from storage or a file. Any string must
  return a `Chord` or `null`, never throw or loop.

## What is out of scope

- What an application does on a match; which chords it allows.
- Real gamepad data beyond the standard mapping's shape.
