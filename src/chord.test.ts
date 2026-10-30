import { expect, test } from 'bun:test'
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
