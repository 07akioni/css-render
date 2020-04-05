import {
  CSSRenderInstance
} from './types'

/** &amp; regex */
const _ar = /&/g

/** resolve selector */
function r$ (amp: string, selector: string): string {
  if (selector.includes(',')) {
    return selector.split(_sr).map(part => {
      if (_ar.test(part)) {
        return part.replace(_ar, amp)
      } else {
        return amp + ' ' + part
      }
    }).join(', ')
  } else if (_ar.test(selector)) {
    return selector.replace(_ar, amp)
  } else {
    return amp + ' ' + selector
  }
}

/** seperator regex */
const _sr = /,(?![^(]*\))/
/** trim regex */
const _tr = /\s+/g

/** parse selector path */
export function p$p (
  selectorPaths: string[],
  instance: CSSRenderInstance
): string {
  let amp = ''
  selectorPaths.forEach(selector => {
    const adpatedSelector = selector
    if (/,/g.test(amp)) {
      amp = amp
        .split(_sr)
        .map(ampPart => r$(ampPart, adpatedSelector))
        .join(', ')
    } else {
      amp = r$(amp, adpatedSelector)
    }
  })
  return amp.trim().replace(_tr, ' ')
}
