const toEventKey = new Map<string, string>([
  ['Esc', 'Escape'],
  ['Escape', 'Escape'],
  ['↑', 'ArrowUp'],
  ['ArrowUp', 'ArrowUp'],
  ['↓', 'ArrowDown'],
  ['ArrowDown', 'ArrowDown'],
  ['Left', 'ArrowLeft'],
  ['ArrowLeft', 'ArrowLeft'],
  ['Right', 'ArrowRight'],
  ['ArrowRight', 'ArrowRight'],
  ['Space', ' '],
  [' ', ' '],
])

const fromEventKey = new Map<string, string>([
  ['Escape', 'Esc'],
  ['ArrowUp', '↑'],
  ['ArrowDown', '↓'],
  ['ArrowLeft', 'Left'],
  ['ArrowRight', 'Right'],
  [' ', 'Space'],
])

const modifiers = new Set(['Control', 'Shift', 'Alt', 'Meta', 'OS', 'Hyper', 'Super'])

// Shifted digits/symbols set event.key to '!' / '_' / …; stored chords name the unshifted key.
const unshiftedByCode = new Map<string, string>([
  ['Digit0', '0'],
  ['Digit1', '1'],
  ['Digit2', '2'],
  ['Digit3', '3'],
  ['Digit4', '4'],
  ['Digit5', '5'],
  ['Digit6', '6'],
  ['Digit7', '7'],
  ['Digit8', '8'],
  ['Digit9', '9'],
  ['Minus', '-'],
  ['Equal', '='],
  ['BracketLeft', '['],
  ['BracketRight', ']'],
  ['Backslash', '\\'],
  ['Semicolon', ';'],
  ['Quote', "'"],
  ['Backquote', '`'],
  ['Comma', ','],
  ['Period', '.'],
  ['Slash', '/'],
])

function eventKey(key: string): string {
  const mapped = toEventKey.get(key)
  if (mapped) {
    return mapped
  }
  if (key.length === 1) {
    return key.toLowerCase()
  }
  return key
}

function physicalKey(c: { key: string; code?: string; shiftKey?: boolean }): string {
  if (c.shiftKey && c.code) {
    const unshifted = unshiftedByCode.get(c.code)
    if (unshifted) {
      return unshifted
    }
  }
  return eventKey(c.key)
}

function chordKey(c: {
  key: string
  code?: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
}): string {
  const ctrl = Boolean(c.ctrlKey || c.metaKey)
  return `${ctrl ? 1 : 0}${c.shiftKey ? 1 : 0}${c.altKey ? 1 : 0}${physicalKey(c)}`
}

/** A key and its modifiers, as a KeyboardEvent carries them. Meta folds into Ctrl: `Cmd+K` and `Ctrl+K` are one chord. */
export interface Chord {
  key: string
  /** Physical key (`Digit1`, `Minus`, …). Shifted digits and symbols match this, not `key`. */
  code?: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
}

export function parseKeys(keys: string): Chord | null {
  // A trailing "+" is the plus key itself ("Ctrl++"), not a separator.
  const plus = keys === '+' || keys.endsWith('++')
  const parts = (plus ? keys.slice(0, -1) : keys).split('+').filter(Boolean)
  if (parts.length === 0 && !plus) {
    return null
  }
  let ctrlKey = false
  let shiftKey = false
  let altKey = false
  let key = plus ? '+' : ''
  for (const part of parts) {
    const token = part.toLowerCase()
    if (
      token === 'ctrl' ||
      token === 'cmd' ||
      token === 'meta' ||
      token === 'control' ||
      token === 'command'
    ) {
      ctrlKey = true
    } else if (token === 'shift') {
      shiftKey = true
    } else if (token === 'alt') {
      altKey = true
    } else {
      key = eventKey(part)
    }
  }
  if (!key) {
    return null
  }
  return { key, ctrlKey, shiftKey, altKey }
}

export function formatChord(e: Chord): string | null {
  if (modifiers.has(e.key) || e.key === '') {
    return null
  }
  const parts: string[] = []
  if (e.ctrlKey || e.metaKey) {
    parts.push('Ctrl')
  }
  if (e.shiftKey) {
    parts.push('Shift')
  }
  if (e.altKey) {
    parts.push('Alt')
  }
  const key = physicalKey(e)
  const display = fromEventKey.get(key) ?? (key.length === 1 ? key.toUpperCase() : key)
  parts.push(display)
  return parts.join('+')
}

export function matchChord<Id extends string>(
  e: Chord,
  bindings: Readonly<Record<Id, string>>,
): Id | null {
  const want = chordKey(e)
  for (const [id, keys] of Object.entries<string>(bindings)) {
    const parsed = parseKeys(keys)
    if (parsed && chordKey(parsed) === want) {
      return id as Id
    }
  }
  return null
}
