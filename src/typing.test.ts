import { expect, test } from 'bun:test'
import { isTypingTarget } from './typing.ts'

test('text inputs type, checkboxes and switches do not', () => {
  expect(isTypingTarget({ tagName: 'INPUT', type: 'text' })).toBe(true)
  expect(isTypingTarget({ tagName: 'INPUT', type: '' })).toBe(true)
  expect(isTypingTarget({ tagName: 'INPUT', type: 'checkbox' })).toBe(false)
  expect(isTypingTarget({ tagName: 'INPUT', type: 'range' })).toBe(false)
})

test('an input type no list names counts as typing', () => {
  expect(isTypingTarget({ tagName: 'INPUT', type: 'datetime-future' })).toBe(true)
})

test('other typing elements, and nothing', () => {
  expect(isTypingTarget({ tagName: 'TEXTAREA' })).toBe(true)
  expect(isTypingTarget({ tagName: 'SELECT' })).toBe(true)
  expect(isTypingTarget({ tagName: 'DIV', isContentEditable: true })).toBe(true)
  expect(isTypingTarget({ tagName: 'DIV' })).toBe(false)
  expect(isTypingTarget(null)).toBe(false)
})
