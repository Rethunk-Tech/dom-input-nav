import type { Page } from '@playwright/test'
import { Button } from './buttons.ts'

// A standard-mapping pad the page polls through navigator.getGamepads, driven by setting globalThis.pad.
async function installPad(page: Page, id = 'Steam Virtual Gamepad'): Promise<void> {
  await page.addInitScript((padId) => {
    const buttons: boolean[] = new Array(17).fill(false)
    const state = { buttons, axes: [0, 0, 0, 0] }
    Object.assign(globalThis, { pad: state })
    navigator.getGamepads = () => [
      {
        id: padId,
        index: 0,
        connected: true,
        mapping: 'standard',
        timestamp: performance.now(),
        axes: state.axes,
        buttons: state.buttons.map((pressed) => ({
          pressed,
          touched: pressed,
          value: pressed ? 1 : 0,
        })),
        hapticActuators: [],
        vibrationActuator: null,
      } as unknown as Gamepad,
    ]
  }, id)
}

/** Presses and releases one button, a few frames each, as a thumb would. */
async function press(page: Page, button: number): Promise<void> {
  for (const down of [true, false]) {
    await page.evaluate(
      ([b, d]) =>
        new Promise<void>((done) => {
          ;(globalThis as unknown as { pad: { buttons: boolean[] } }).pad.buttons[b] = d
          requestAnimationFrame(() => requestAnimationFrame(() => done()))
        }),
      [button, down] as const,
    )
  }
}

export { Button, installPad, press }
