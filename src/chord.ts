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

function chordKey(c: {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
}): string {
  const ctrl = Boolean(c.ctrlKey || c.metaKey)
  return `${ctrl ? 1 : 0}${c.shiftKey ? 1 : 0}${c.altKey ? 1 : 0}${eventKey(c.key)}`
}

/** A key and its modifiers, as a KeyboardEvent carries them. Meta folds into Ctrl: `Cmd+K` and `Ctrl+K` are one chord. */
export interface Chord {
  key: string
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
    if (part === 'Ctrl' || part === 'Cmd' || part === 'Meta') {
      ctrlKey = true
    } else if (part === 'Shift') {
      shiftKey = true
    } else if (part === 'Alt') {
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
  const display = fromEventKey.get(e.key) ?? (e.key.length === 1 ? e.key.toUpperCase() : e.key)
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
