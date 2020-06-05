import { CSelectorPath } from './types'

function ampCount (selector: string): number {
  const len = selector.length
  let cnt = 0
  for (let i = 0; i < len; ++i) {
    if (selector[i] === '&') ++cnt
  }
  return cnt
}

/**
 * Don't just use ',' to separate css selector. For example:
 * x:(a, b) {} will be split into 'x:(a' and 'b)', which is not expected.
 * Make sure comma doesn't exist inside parentheses.
 */
const seperatorRegex = /,(?![^(]*\))/
const extraSpaceRegex = /\s+/g

/**
 * selector must includes '&'
 */
function resolveSelectorWithAmp (amp: string[], selector: string): string[] {
  const nextAmp: string[] = []
  selector.split(seperatorRegex).forEach(selectorPart => {
    let round = ampCount(selectorPart)
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

/**
 * selector mustn't includes '&'
 */
function resolveSelector (amp: string[], selector: string): string[] {
  const result: string[] = []
  selector.split(seperatorRegex).forEach(selectorPart => {
    amp.forEach(ampPart => {
      result.push((ampPart + ' ' + selectorPart).trim())
    })
  })
  return result
}

export function parseSelectorPath (
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
      amp = resolveSelectorWithAmp(amp, selector)
    } else {
      amp = resolveSelector(amp, selector)
    }
  })
  return amp.join(', ').trim().replace(extraSpaceRegex, ' ')
}
