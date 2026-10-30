import { expect, test } from 'bun:test'
import { arrowFocus, nextIndex } from './arrowFocus.ts'

// A 3-wide grid of 100px cells with a short last row: 0 1 2 / 3 4 5 / 6.
const cell = (i: number) => {
  const left = (i % 3) * 100
  const top = Math.floor(i / 3) * 100
  return { left, right: left + 90, top, bottom: top + 90 }
}
const grid = Array.from({ length: 7 }, (_, i) => cell(i))

test('arrows walk a grid', () => {
  expect(nextIndex(grid, 4, 'ArrowRight')).toBe(5)
  expect(nextIndex(grid, 0, 'ArrowLeft')).toBe(-1)
  expect(nextIndex(grid, 1, 'ArrowDown')).toBe(4)
  expect(nextIndex(grid, 5, 'ArrowDown')).toBe(6)
  expect(nextIndex(grid, 6, 'ArrowUp')).toBe(3)
  expect(nextIndex(grid, 1, 'ArrowUp')).toBe(-1)
  expect(nextIndex(grid, 6, 'ArrowDown')).toBe(-1)
  expect(nextIndex(grid, 1, 'Enter')).toBe(-1)
})

test('arrowFocus moves focus to the next item and leaves text fields alone', () => {
  document.body.innerHTML = '<div id="row"><button id="a">a</button><button id="b">b</button></div>'
  const row = document.getElementById('row') as HTMLElement
  const [a, b] = [document.getElementById('a'), document.getElementById('b')] as HTMLElement[]
  a?.focus()
  let prevented = false
  const event = (target: EventTarget) => ({
    key: 'ArrowRight',
    defaultPrevented: false,
    target,
    currentTarget: row,
    preventDefault: () => {
      prevented = true
    },
  })
  arrowFocus(event(a as HTMLElement), 'button')
  expect(document.activeElement).toBe(b as HTMLElement)
  expect(prevented).toBe(true)
})
