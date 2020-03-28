import {
  CSelector
} from './types'

function resolveSelector (amp: string, selector: string): string {
  if (selector.includes(',')) {
    return selector.split(',').map(part => {
      const trimmedPart = part
      if (/&/g.test(trimmedPart)) {
        return trimmedPart.replace(/&/g, amp)
      } else {
        return amp + ' ' + trimmedPart
      }
    }).join(', ')
  } else if (/&/g.test(selector)) {
    return selector.replace(/&/g, amp)
  } else {
    return amp + ' ' + selector
  }
}

export default function parseSelectorPath (selectors: Array<string | CSelector>): string {
  let amp = ''
  selectors.forEach(selector => {
    const adpatedSelector = typeof selector === 'string' ? selector : selector.selector()
    if (/,/g.test(amp)) {
      amp = amp
        .split(',')
        .map(ampPart => resolveSelector(ampPart, adpatedSelector))
        .join(', ')
    } else {
      amp = resolveSelector(amp, adpatedSelector)
    }
  })
  return amp.trim().replace(/\s+/g, ' ')
}
