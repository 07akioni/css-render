import { CSelectorPath } from './types'

/**
 * amp count
 */
function _ac (selector: string): number {
  const len = selector.length
  let cnt = 0
  for (let i = 0; i < len; ++i) {
    if (selector[i] === '&') ++cnt
  }
  return cnt
}

/**
 * resolve selector
 * selector must includes '&'
 */
function r$1 (amp: string[], selector: string): string[] {
  const nextAmp: string[] = []
  selector.split(_sr).forEach(selectorPart => {
    let round = _ac(selectorPart)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!round) {
      amp.forEach(ampPart => {
        nextAmp.push(
          (ampPart + ' ' + selectorPart).trim()
        )
      })
      return
    }
    let partialNextAmp: string[] = [
      selectorPart
    ]
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    while (round--) {
      const nextPartialNextAmp: string[] = []
      partialNextAmp.forEach(selectorItr => {
        amp.forEach(
          ampPart => {
            nextPartialNextAmp.push(selectorItr.replace('&', ampPart))
          }
        )
      })
      partialNextAmp = nextPartialNextAmp
    }
    partialNextAmp.forEach(part => nextAmp.push(part))
  })
  return nextAmp
}

function r$2 (amp: string[], selector: string): string[] {
  const result: string[] = []
  selector.split(_sr).forEach(selectorPart => {
    amp.forEach(ampPart => {
      result.push((ampPart + ' ' + selectorPart).trim())
    })
  })
  return result
}

/** seperator regex */
const _sr = /,(?![^(]*\))/
/** trim regex */
const _tr = /\s+/g

/** parse selector path */
export function p$p (
  selectorPaths: CSelectorPath
): string {
  let amp: string[] = ['']
  selectorPaths.forEach(selector => {
    // eslint-disable-next-line
    selector = selector && selector.trim()
    if (
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      !selector
    ) {
      /**
       * if it's a empty selector, do nothing
       */
      return
    }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (selector.includes('&')) {
      amp = r$1(amp, selector)
    } else {
      amp = r$2(amp, selector)
    }
  })
  return amp.join(', ').trim().replace(_tr, ' ')
}
