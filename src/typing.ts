export interface TypingTarget {
  tagName?: string
  isContentEditable?: boolean
  type?: string
  parentElement?: TypingTarget | null
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

/** With `ancestors`, an element inside a typing target (a contenteditable's child, say) counts too. */
export function isTypingTarget(
  el: TypingTarget | null,
  { ancestors = false }: { ancestors?: boolean } = {},
): boolean {
  for (let at = el; at; at = ancestors ? (at.parentElement ?? null) : null) {
    if (typesHere(at)) {
      return true
    }
  }
  return false
}

function typesHere(el: TypingTarget): boolean {
  const tag = el.tagName
  if (tag === 'INPUT') {
    return !nonTextInputs.has((el.type ?? '').toLowerCase())
  }
  if (tag === 'TEXTAREA' || tag === 'SELECT') {
    return true
  }
  return Boolean(el.isContentEditable)
}
