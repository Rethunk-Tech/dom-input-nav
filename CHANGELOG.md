# Changelog

Notable changes to `dom-input-nav`. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-11-08

### Added

- `@rethunk/dom-input-nav/playwright`: `installPad`, `press` and `Button` fake a standard-mapping gamepad in a Playwright test.
- `Button`: the W3C standard-mapping button indices, exported for mapping code.

## [0.1.2] - 2026-11-07

### Fixed

- A binding named like an `Object.prototype` member, such as `constructor`, no longer throws.

## [0.1.1] - 2026-10-30

### Added

- `isTypingTarget(el, { ancestors: true })`: also counts an element inside a typing target.
- `typeaheadChar`, `typedKey`, `typedMatch`, `TYPE_RESET_MS`: list typeahead over typed characters.

## [0.1.0] - 2026-10-30

### Added

- `isTypingTarget`: which focused elements take typed text.
- `parseKeys`, `formatChord`, `matchChord`: stored chord strings matched against key events.
- `arrowFocus`, `nextIndex`: arrow-key focus over a grid or row.
- `heldActions`, `firedActions`, `heldElsewhere`, `spatialNext`: standard-mapping gamepad input.

[0.1.1]: https://github.com/Rethunk-Tech/dom-input-nav/releases/tag/v0.1.1
[0.1.0]: https://www.npmjs.com/package/@rethunk/dom-input-nav/v/0.1.0
[Unreleased]: https://github.com/Rethunk-Tech/dom-input-nav/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/Rethunk-Tech/dom-input-nav/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/Rethunk-Tech/dom-input-nav/compare/v0.1.1...v0.1.2
