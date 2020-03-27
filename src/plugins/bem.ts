import {
  CSelector
} from '@/types'
const namespace = 'n'

let block: string = null
let elements: string[] = null

export const b = function (arg: string): CSelector {
  return {
    beforeEnter () {
      block = arg
      elements = null
    },
    afterLeave () {
      block = null
    },
    selector () {
      return `.${namespace}-${block}`
    }
  }
}

export const e = function (...args: string[]): CSelector {
  return {
    beforeEnter () {
      elements = args
    },
    afterLeave () {
      elements = null
    },
    selector () {
      return args.map(arg => `.${namespace}-${block}__${arg}`).join(', ')
    }
  }
}

export const m = function (...args: string[]): CSelector {
  return {
    beforeEnter () {},
    afterLeave () {},
    selector () {
      function elementToSelector (element?: string): string {
        return args.map(arg => `&.${namespace}-${block}${
          element !== undefined ? `__${element}` : ''
        }--${arg}`).join(', ')
      }
      return elements !== null ? elements.map(
        elementToSelector
      ).join(', ') : elementToSelector()
    }
  }
}

export const notM = function (arg: string): CSelector {
  return {
    beforeEnter () {},
    selector () {
      return `&:not(.${namespace}-${block}${
        (elements !== null && elements.length > 0) ? `__${elements[0]}` : ''
      }--${arg})`
    }
  }
}
