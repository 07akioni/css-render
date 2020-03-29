import {
  CSelector,
  CContext
} from 'css-render'

let _bPrefix: string = '.'
let _ePrefix: string = '__'
let _mPrefix: string = '--'

interface BEMPluginOptions {
  blockPrefix?: string
  elementPrefix?: string
  modifierPrefix?: string
}

export const setup = function (context: CContext, options: BEMPluginOptions = {}): any {
  if (options.blockPrefix !== undefined) {
    _bPrefix = options.blockPrefix
  }
  if (options.elementPrefix !== undefined) {
    _ePrefix = options.elementPrefix
  }
  if (options.modifierPrefix !== undefined) {
    _mPrefix = options.modifierPrefix
  }
  context.bem = {}
  context.bem.block = null
  context.bem.elements = null
}

export const b = function (arg: string): CSelector {
  return {
    beforeEnter (context) {
      context.bem.block = arg
      context.bem.elements = null
    },
    afterLeave (context) {
      context.bem.block = null
    },
    selector (context) {
      return `${_bPrefix}${context.bem.block as string}`
    }
  }
}

export const e = function (...args: string[]): CSelector {
  return {
    beforeEnter (context) {
      context.bem.elements = args
    },
    afterLeave (context) {
      context.bem.elements = null
    },
    selector (context) {
      return args.map(arg => `.${_bPrefix}${context.bem.block as string}__${arg}`).join(', ')
    }
  }
}

export const m = function (...args: string[]): CSelector {
  return {
    selector (context) {
      function elementToSelector (element?: string): string {
        return args.map(arg => `&.${_bPrefix}${context.bem.block as string}${
          element !== undefined ? `${_ePrefix}${element}` : ''
        }${_mPrefix}${arg}`).join(', ')
      }
      return context.bem.elements !== null ? context.bem.elements.map(
        elementToSelector
      ).join(', ') : elementToSelector()
    }
  }
}

export const notM = function (arg: string): CSelector {
  return {
    selector (context) {
      const elements = context.bem.elements as null | string[]
      return `&:not(.${_bPrefix}${context.bem.block as string}${
        (elements !== null && elements.length > 0) ? `${_ePrefix}${elements[0]}` : ''
      }${_mPrefix}${arg})`
    }
  }
}
