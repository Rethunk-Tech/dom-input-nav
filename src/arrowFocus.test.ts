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

test('arrowFocus takes a native keydown, and a text field keeps its arrow keys', () => {
  document.body.innerHTML =
    '<div id="row"><button id="a">a</button><input id="t"><button id="b">b</button></div>'
  const row = document.getElementById('row') as HTMLElement
  row.addEventListener('keydown', (e) => arrowFocus(e, 'button, input'))
  const press = (el: HTMLElement) =>
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))

  const a = document.getElementById('a') as HTMLElement
  a.focus()
  press(a)
  const t = document.getElementById('t') as HTMLElement
  expect(document.activeElement).toBe(t)

  press(t)
  expect(document.activeElement).toBe(t)
})

test('arrowFocus skips a disabled item and lands on the next', () => {
  document.body.innerHTML =
    '<div id="row"><button id="a">A</button><button id="b" disabled>B</button><button id="c">C</button></div>'
  const row = document.getElementById('row') as HTMLElement
  const a = document.getElementById('a') as HTMLElement
  const c = document.getElementById('c') as HTMLElement
  a.focus()
  arrowFocus(
    {
      key: 'ArrowRight',
      defaultPrevented: false,
      target: a,
      currentTarget: row,
      preventDefault: () => undefined,
    },
    'button',
  )
  expect(document.activeElement).toBe(c)
})

test('arrowFocus leaves range and radio inputs their arrow keys', () => {
  document.body.innerHTML =
    '<div id="row"><div class="card"><input id="range" type="range"></div><div class="card"><input id="radio" type="radio"><input type="radio"></div></div>'
  const row = document.getElementById('row') as HTMLElement
  const range = document.getElementById('range') as HTMLInputElement
  const radio = document.getElementById('radio') as HTMLInputElement
  const fire = (target: HTMLElement, key: string) => {
    let prevented = false
    arrowFocus(
      {
        key,
        defaultPrevented: false,
        target,
        currentTarget: row,
        preventDefault: () => {
          prevented = true
        },
      },
      '.card',
    )
    return prevented
  }
  range.focus()
  expect(fire(range, 'ArrowRight')).toBe(false)
  expect(document.activeElement).toBe(range)
  radio.focus()
  expect(fire(radio, 'ArrowDown')).toBe(false)
  expect(document.activeElement).toBe(radio)
})

test('arrowFocus skips a hidden input and focuses the next card button', () => {
  document.body.innerHTML =
    '<div id="row"><div class="card"><input type="hidden"><button id="a">a</button></div><div class="card"><input type="hidden"><button id="b">b</button></div></div>'
  const row = document.getElementById('row') as HTMLElement
  const a = document.getElementById('a') as HTMLElement
  const b = document.getElementById('b') as HTMLElement
  a.focus()
  arrowFocus(
    {
      key: 'ArrowRight',
      defaultPrevented: false,
      target: a,
      currentTarget: row,
      preventDefault: () => undefined,
    },
    '.card',
  )
  expect(document.activeElement).toBe(b)
})

test('nextIndex enters the list when nothing in it is focused', () => {
  expect(nextIndex(grid, -1, 'ArrowDown')).toBe(0)
  expect(nextIndex(grid, -1, 'ArrowRight')).toBe(0)
  expect(nextIndex(grid, -1, 'ArrowUp')).toBe(grid.length - 1)
  expect(nextIndex(grid, -1, 'ArrowLeft')).toBe(grid.length - 1)
})

test('arrowFocus follows the event target inside a shadow root', () => {
  const host = document.createElement('div')
  document.body.replaceChildren(host)
  const shadow = host.attachShadow({ mode: 'open' })
  shadow.innerHTML = '<div id="row"><button id="a">a</button><button id="b">b</button></div>'
  const row = shadow.getElementById('row') as HTMLElement
  const a = shadow.getElementById('a') as HTMLElement
  const b = shadow.getElementById('b') as HTMLElement
  a.focus()
  arrowFocus(
    {
      key: 'ArrowRight',
      defaultPrevented: false,
      target: a,
      currentTarget: row,
      preventDefault: () => undefined,
    },
    'button',
  )
  expect(shadow.activeElement).toBe(b)
})

test('arrowFocus skips a disabled control that has a tabindex', () => {
  document.body.innerHTML =
    '<div id="row"><button id="a">a</button><button id="x" tabindex="0" disabled>x</button><button id="b">b</button></div>'
  const row = document.getElementById('row') as HTMLElement
  const a = document.getElementById('a') as HTMLElement
  a.focus()
  arrowFocus(
    {
      key: 'ArrowRight',
      defaultPrevented: false,
      target: a,
      currentTarget: row,
      preventDefault() {},
    },
    'button',
  )
  expect(document.activeElement).toBe(document.getElementById('b') as HTMLElement)
})

test('arrowFocus passes over an item that cannot take focus', () => {
  document.body.innerHTML =
    '<div id="row"><button id="a">a</button><button id="h" hidden>h</button><button id="b">b</button></div>'
  const row = document.getElementById('row') as HTMLElement
  const a = document.getElementById('a') as HTMLElement
  a.focus()
  const hidden = document.getElementById('h') as HTMLElement
  hidden.focus = () => undefined
  arrowFocus(
    {
      key: 'ArrowRight',
      defaultPrevented: false,
      target: a,
      currentTarget: row,
      preventDefault() {},
    },
    'button',
  )
  expect(document.activeElement).toBe(document.getElementById('b') as HTMLElement)
})

test('arrowFocus steps the other way in a right-to-left row', () => {
  document.body.innerHTML =
    '<div id="row" dir="rtl" style="direction: rtl"><button id="a">a</button><button id="b">b</button></div>'
  const row = document.getElementById('row') as HTMLElement
  const a = document.getElementById('a') as HTMLElement
  a.focus()
  arrowFocus(
    {
      key: 'ArrowLeft',
      defaultPrevented: false,
      target: a,
      currentTarget: row,
      preventDefault() {},
    },
    'button',
  )
  expect(document.activeElement).toBe(document.getElementById('b') as HTMLElement)
})
