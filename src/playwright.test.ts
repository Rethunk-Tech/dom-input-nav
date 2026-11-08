import { expect, test } from 'bun:test'
import { heldActions } from './gamepad.ts'
import { Button } from './playwright.ts'

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
