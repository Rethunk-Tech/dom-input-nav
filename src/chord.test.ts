import { expect, test } from 'bun:test'
import fc from 'fast-check'
import { formatChord, matchChord, parseKeys } from './chord.ts'

const table = {
  palette: 'Ctrl+K',
  play: 'Ctrl+P',
  newItem: 'Ctrl+N',
  notifications: 'Ctrl+Shift+N',
  back: 'Alt+Left',
  refresh: 'F5',
  dismiss: 'Esc',
  up: '↑',
  down: '↓',
  toggle: 'Space',
}

// Each modifier and each key whose table name differs from the browser's event key.
test('matchChord reads modifiers and named keys as the browser sends them', () => {
  expect(matchChord({ key: 'k', ctrlKey: true }, table)).toBe('palette')
  expect(matchChord({ key: 'p', metaKey: true }, table)).toBe('play')
  expect(matchChord({ key: 'n', ctrlKey: true }, table)).toBe('newItem')
  expect(matchChord({ key: 'n', ctrlKey: true, shiftKey: true }, table)).toBe('notifications')
  expect(matchChord({ key: 'ArrowLeft', altKey: true }, table)).toBe('back')
  expect(matchChord({ key: 'ArrowLeft' }, table)).toBeNull()
  expect(matchChord({ key: 'F5' }, table)).toBe('refresh')
  expect(matchChord({ key: 'Escape' }, table)).toBe('dismiss')
  expect(matchChord({ key: 'ArrowUp' }, table)).toBe('up')
  expect(matchChord({ key: 'ArrowDown' }, table)).toBe('down')
  expect(matchChord({ key: ' ' }, table)).toBe('toggle')
})

test('parseKeys and formatChord round-trip the table', () => {
  for (const keys of Object.values(table)) {
    const parsed = parseKeys(keys)
    expect(parsed).not.toBeNull()
    expect(formatChord(parsed as NonNullable<typeof parsed>)).toBe(keys)
  }
})

test('the plus key round-trips and fires', () => {
  for (const chord of [
    { key: '+', ctrlKey: true },
    { key: '+' },
    { key: '+', ctrlKey: true, shiftKey: true },
  ]) {
    const keys = formatChord(chord) as string
    expect(parseKeys(keys)).toMatchObject({ key: '+', ctrlKey: Boolean(chord.ctrlKey) })
    expect(matchChord(chord, { play: keys })).toBe('play')
  }
})

test('formatChord ignores modifier-only presses', () => {
  expect(formatChord({ key: 'Control', ctrlKey: true })).toBeNull()
  expect(formatChord({ key: 'Shift', shiftKey: true })).toBeNull()
})

test('a chord stored empty matches no key, and the first id holding a chord wins', () => {
  expect(matchChord({ key: 'k', ctrlKey: true }, { a: '', b: 'Ctrl+K', c: 'Ctrl+K' })).toBe('b')
})

test('Meta folds into Ctrl', () => {
  expect(parseKeys('Cmd+K')).toEqual(parseKeys('Ctrl+K'))
  expect(formatChord({ key: 'k', metaKey: true })).toBe('Ctrl+K')
})

test('a binding named like an Object.prototype member never matches or throws', () => {
  const e = { key: 'a', ctrlKey: true }
  for (const keys of [
    'constructor',
    'hasOwnProperty',
    'Ctrl+constructor',
    'toString',
    '__proto__',
  ]) {
    expect(matchChord(e, { x: keys })).toBeNull()
  }
})

const eventKeyArb = fc.constantFrom(
  'Escape',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  ' ',
  'F5',
  'Enter',
  'Tab',
  'Home',
  'End',
  '+',
  ...'abcdefghijklmnopqrstuvwxyz0123456789'.split(''),
)

const chordArb = fc.record({
  key: eventKeyArb,
  ctrlKey: fc.boolean(),
  shiftKey: fc.boolean(),
  altKey: fc.boolean(),
})

test('parseKeys does not throw and a hit always has a key', () => {
  fc.assert(
    fc.property(fc.string(), (keys) => {
      const parsed = parseKeys(keys)
      return parsed === null || parsed.key.length > 0
    }),
  )
})

test('formatChord then parseKeys recovers the chord', () => {
  fc.assert(
    fc.property(chordArb, (c) => {
      const keys = formatChord(c)
      if (keys === null) {
        return false
      }
      const parsed = parseKeys(keys)
      return (
        parsed !== null &&
        parsed.key === c.key &&
        parsed.ctrlKey === c.ctrlKey &&
        parsed.shiftKey === c.shiftKey &&
        parsed.altKey === c.altKey
      )
    }),
  )
})

test('formatChord of a parsed format is idempotent', () => {
  fc.assert(
    fc.property(chordArb, (c) => {
      const keys = formatChord(c)
      if (keys === null) {
        return false
      }
      const parsed = parseKeys(keys)
      return parsed !== null && formatChord(parsed) === keys
    }),
  )
})

test('matchChord agrees with parseKeys on a formatted self-binding', () => {
  fc.assert(
    fc.property(chordArb, (c) => {
      const keys = formatChord(c)
      if (keys === null) {
        return false
      }
      return matchChord(c, { go: keys }) === 'go'
    }),
  )
})

test('matchChord hits only an own binding id whose stored chord parses', () => {
  const idArb = fc.stringMatching(/^[A-Za-z][A-Za-z0-9]{0,7}$/)
  fc.assert(
    fc.property(fc.dictionary(idArb, fc.string(), { maxKeys: 8 }), chordArb, (bindings, e) => {
      const id = matchChord(e, bindings)
      if (id === null) {
        return true
      }
      return Object.hasOwn(bindings, id) && parseKeys(bindings[id] as string) !== null
    }),
  )
})
