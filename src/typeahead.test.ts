import { expect, test } from 'bun:test'
import { typeaheadChar, typedKey, typedMatch } from './typeahead.ts'

const key = (k: string, extra: object = {}) => ({
  key: k,
  ctrlKey: false,
  altKey: false,
  metaKey: false,
  target: null,
  ...extra,
})

test('typedKey drops punctuation and accents', () => {
  expect(typedKey('R.E.P.O.')).toBe('repo')
  expect(typedKey('Café')).toBe('cafe')
})

test('typedMatch prefers a prefix over a substring', () => {
  const names = ['The Repo', 'Repo Two']
  expect(typedMatch(names, 'rep', (n) => n)).toBe('Repo Two')
  expect(typedMatch(names, 'two', (n) => n)).toBe('Repo Two')
  expect(typedMatch(names, '!', (n) => n)).toBeUndefined()
})

test('typeaheadChar takes plain characters outside fields only', () => {
  expect(typeaheadChar(key('a'))).toBe('a')
  expect(typeaheadChar(key('7'))).toBe('7')
  expect(typeaheadChar(key(' '))).toBeUndefined()
  expect(typeaheadChar(key('Enter'))).toBeUndefined()
  expect(typeaheadChar(key('a', { ctrlKey: true }))).toBeUndefined()
  expect(typeaheadChar(key('a', { target: { tagName: 'INPUT', type: 'text' } }))).toBeUndefined()
  expect(typeaheadChar(key('a', { target: { tagName: 'INPUT', type: 'checkbox' } }))).toBe('a')
})

test('typeaheadChar ignores keys that belong to an IME composition', () => {
  expect(typeaheadChar(key('a', { isComposing: true }))).toBeUndefined()
  expect(typeaheadChar(key('a'))).toBe('a')
})
