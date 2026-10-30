export interface TypingTarget {
  tagName?: string
  isContentEditable?: boolean
  type?: string
}

// Input types that take no typed text, so a shortcut or arrow key may pass through them.
const nonTextInputs = new Set([
  'checkbox',
  'radio',
  'range',
  'button',
  'submit',
  'reset',
  'image',
  'color',
  'file',
])

export function isTypingTarget(el: TypingTarget | null): boolean {
  if (!el) {
    return false
  }
  const tag = el.tagName
  if (tag === 'INPUT') {
    return !nonTextInputs.has((el.type ?? '').toLowerCase())
  }
  if (tag === 'TEXTAREA' || tag === 'SELECT') {
    return true
  }
  return Boolean(el.isContentEditable)
}
