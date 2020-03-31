import {
  CSelector,
  CSSRenderInstance
} from './types'

/** resolve selector */
function r$ (amp: string, selector: string): string {
  if (selector.includes(',')) {
    return selector.split(',').map(part => {
      if (/&/g.test(part)) {
        return part.replace(/&/g, amp)
      } else {
        return amp + ' ' + part
      }
    }).join(', ')
  } else if (/&/g.test(selector)) {
    return selector.replace(/&/g, amp)
  } else {
    return amp + ' ' + selector
  }
}

/** parse selector path */
export function p$p (
  selectors: Array<string | CSelector>,
  instance: CSSRenderInstance
): string {
  let amp = ''
  selectors.forEach(selector => {
    const adpatedSelector = typeof selector === 'string' ? selector : selector.selector(instance.context)
    if (/,/g.test(amp)) {
      amp = amp
        .split(',')
        .map(ampPart => r$(ampPart, adpatedSelector))
        .join(', ')
    } else {
      amp = r$(amp, adpatedSelector)
    }
  })
  return amp.trim().replace(/\s+/g, ' ')
}
