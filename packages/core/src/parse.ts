import { CSelectorPath } from './types'

/** &amp; regex */
const _ar = /&/g

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

/** resolve selector */
function r$ (amps: string[], selector: string): string {
  const selectorParts = selector.split(_sr)
  return selectorParts.map(selectorPart => {
    let round = _ac(selectorPart)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!round) {
      return amps.map(amp => amp + ' ' + selectorPart)
    }
    let result: string[] = [
      selectorPart
    ]
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    while (round--) {
      const nextResult: string[] = []
      result.forEach(selectorItr => {
        amps.forEach(
          amp => {
            nextResult.push(selectorItr.replace('&', amp))
          }
        )
      })
      result = nextResult
    }
    console.log('result', result)
    return result.join(', ')
  }).join(', ')
}

/** seperator regex */
const _sr = /,(?![^(]*\))/
/** trim regex */
const _tr = /\s+/g

/** parse selector path */
export function p$p (
  selectorPaths: CSelectorPath
): string {
  let amp = ''
  selectorPaths.forEach(selector => {
    // eslint-disable-next-line
    selector = selector && selector.trim()
    if (
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      !selector
    ) {
      return
    }
    if (!selector.includes('&')) {
      if (_sr.test(amp)) {
        if (_sr.test(selector)) {
          const selectorParts = selector.split(_sr)
          /**
           * selector: no & and has comma
           * amp: has comma
           */
          amp = amp
            .split(_sr)
            .map(ampPart => {
              return selectorParts
                .map(selectorPart => ampPart + ' ' + selectorPart)
                .join(', ')
            })
            .join(', ')
            .trim()
        } else {
          /**
           * selector: no & and has no comma
           * amp: has comma
           */
          amp = amp
            .split(_sr)
            .map(part => part + ' ' + (selector as string))
            .join(', ')
            .trim()
        }
      } else {
        if (_sr.test(selector)) {
          /**
           * selector: no & and has comma
           * amp: no comma
           */
          amp = selector
            .split(_sr)
            .map(part => amp + ' ' + part)
            .join(', ')
            .trim()
        } else {
          /**
           * selector: no & and no comma
           * amp: no comma
           */
          amp = (amp + ' ' + selector).trim()
        }
      }
    } else if (!_sr.test(amp)) {
      if (!_sr.test(selector)) {
        /**
         * selector: has & and no comma
         * amp: no comma
         */
        amp = selector.replace(_ar, amp).trim()
      } else {
        /**
         * selector: has & and has comma
         * amp: no comma
         */
        amp = selector
          .split(_sr)
          .map(
            part => part.includes('&')
              ? part.replace(_ar, amp)
              : amp + ' ' + part
          )
          .join(', ')
          .trim()
      }
    } else {
      /**
       * selector: has &
       * amp: has comma
       */
      amp = r$(
        amp.split(_sr),
        selector
      ).trim()
    }
  })
  return amp.trim().replace(_tr, ' ')
}
