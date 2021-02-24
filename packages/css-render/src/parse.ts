import { CSelectorPath } from './types'

function ampCount (selector: string): number {
  let cnt = 0
  for (let i = 0; i < selector.length; ++i) {
    if (selector[i] === '&') ++cnt
  }
  return cnt
}

/**
 * Don't just use ',' to separate css selector. For example:
 * x:(a, b) {} will be split into 'x:(a' and 'b)', which is not expected.
 * Make sure comma doesn't exist inside parentheses.
 */
const seperatorRegex = /\s*,(?![^(]*\))\s*/g
const extraSpaceRegex = /\s+/g

/**
 * selector must includes '&'
 * selector is trimmed
 * every part of amp is trimmed
 */
function resolveSelectorWithAmp (amp: string[], selector: string): string[] {
  const nextAmp: string[] = []
  selector.split(seperatorRegex).forEach(partialSelector => {
    let round = ampCount(partialSelector)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!round) {
      amp.forEach(partialAmp => {
        nextAmp.push(
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          (partialAmp && partialAmp + ' ') + partialSelector
        )
      })
      return
    } else if (round === 1) {
      amp.forEach(partialAmp => {
        nextAmp.push(partialSelector.replace('&', partialAmp))
      })
      return
    }
    let partialNextAmp: string[] = [
      partialSelector
    ]
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    while (round--) {
      const nextPartialNextAmp: string[] = []
      partialNextAmp.forEach(selectorItr => {
        amp.forEach(
          partialAmp => {
            nextPartialNextAmp.push(selectorItr.replace('&', partialAmp))
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
 * selector is trimmed
 */
function resolveSelector (amp: string[], selector: string): string[] {
  const nextAmp: string[] = []
  selector.split(seperatorRegex).forEach(partialSelector => {
    amp.forEach(partialAmp => {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      nextAmp.push(((partialAmp && partialAmp + ' ') + partialSelector))
    })
  })
  return nextAmp
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
  return amp.join(', ').replace(extraSpaceRegex, ' ')
}
