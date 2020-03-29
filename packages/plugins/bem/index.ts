import {
  CSelector,
  CSSRenderPlugin
} from 'css-render'

interface BEMPluginOptions {
  blockPrefix?: string
  elementPrefix?: string
  modifierPrefix?: string
}

export default function CSSRenderBEMPlugin (options?: BEMPluginOptions): CSSRenderPlugin {
  let _bPrefix: string = '.'
  let _ePrefix: string = '__'
  let _mPrefix: string = '--'

  if (options !== undefined) {
    if (options.blockPrefix !== undefined) {
      _bPrefix = options.blockPrefix
    }
    if (options.elementPrefix !== undefined) {
      _ePrefix = options.elementPrefix
    }
    if (options.modifierPrefix !== undefined) {
      _mPrefix = options.modifierPrefix
    }
  }

  const plugin: CSSRenderPlugin = {
    install (instance) {
      instance.context.bem = {}
      instance.context.bem.block = null
      instance.context.bem.elements = null
    }
  }

  function b (arg: string): CSelector {
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

  function e (...args: string[]): CSelector {
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

  function m (...args: string[]): CSelector {
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

  const notM = function (arg: string): CSelector {
    return {
      selector (context) {
        const elements = context.bem.elements as null | string[]
        return `&:not(.${_bPrefix}${context.bem.block as string}${
          (elements !== null && elements.length > 0) ? `${_ePrefix}${elements[0]}` : ''
        }${_mPrefix}${arg})`
      }
    }
  }

  Object.assign(plugin, {
    b, e, m, notM
  })

  return plugin
}
