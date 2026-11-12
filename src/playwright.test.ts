import { expect, test } from 'bun:test'
import { heldActions } from './gamepad.ts'
import { Button, installPad, press } from './playwright.ts'

const pad = (pressed: number[]) => ({
  buttons: Array.from({ length: 17 }, (_, i) => ({
    pressed: pressed.includes(i),
    touched: false,
    value: 0,
  })),
  axes: [0, 0],
})

test('the shared button table matches the indices gamepad.ts maps', () => {
  const actions = (button: number) => [...heldActions([pad([button])])]
  expect(actions(Button.a)).toEqual(['confirm'])
  expect(actions(Button.b)).toEqual(['back'])
  expect(actions(Button.lb)).toEqual(['prevTab'])
  expect(actions(Button.rb)).toEqual(['nextTab'])
  expect(actions(Button.start)).toEqual(['start'])
  expect(actions(Button.up)).toEqual(['up'])
  expect(actions(Button.down)).toEqual(['down'])
  expect(actions(Button.left)).toEqual(['left'])
  expect(actions(Button.right)).toEqual(['right'])
})

test('installPad works on an already-loaded page', async () => {
  const queued: Array<() => void> = []
  const page = {
    goto: async () => {
      for (const run of queued.splice(0)) {
        run()
      }
    },
    addInitScript: async (fn: (id: string) => void, id: string) => {
      queued.push(() => fn(id))
    },
    evaluate: async <A, R>(fn: (arg: A) => R | Promise<R>, arg: A) => fn(arg),
  }
  const nav = navigator as Navigator & { getGamepads: typeof navigator.getGamepads }
  const previous = nav.getGamepads
  delete (globalThis as { pad?: unknown }).pad
  try {
    await page.goto()
    await installPad(page as never)
    await press(page as never, Button.a)
    expect((globalThis as { pad?: { buttons: boolean[] } }).pad).toBeDefined()
    expect(navigator.getGamepads()[0]?.buttons.length).toBe(17)
  } finally {
    nav.getGamepads = previous
    delete (globalThis as { pad?: unknown }).pad
  }
})
