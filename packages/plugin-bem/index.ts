/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import {
  COptionSelector,
  CLazySelector,
  CStringSelector,
  CssRenderPlugin,
  createCNode,
  CSelector
} from 'css-render'

interface BEMPluginOptions {
  blockPrefix?: string
  elementPrefix?: string
  modifierPrefix?: string
}

type AvailableSelector = CStringSelector | CLazySelector<string>

interface CssRenderBemPlugin extends CssRenderPlugin {
  cB: createCNode<AvailableSelector>
  cE: createCNode<AvailableSelector>
  cM: createCNode<AvailableSelector>
  cNotM: createCNode<AvailableSelector>
}

function plugin (options?: BEMPluginOptions): CssRenderBemPlugin {
  let _bPrefix: string = '.'
  let _ePrefix: string = '__'
  let _mPrefix: string = '--'
  let c: createCNode<CSelector>
  if (options) {
    let t = options.blockPrefix
    if (t) {
      _bPrefix = t
    }
    t = options.elementPrefix
    if (t) {
      _ePrefix = t
    }
    t = options.modifierPrefix
    if (t) {
      _mPrefix = t
    }
  }

  const _plugin: CssRenderPlugin = {
    install (instance) {
      c = instance.c
      const ctx = instance.context
      ctx.bem = {}
      ctx.bem.b = null
      ctx.bem.els = null
    }
  }

  function b (arg: AvailableSelector): COptionSelector {
    let memorizedB: string | null
    let memorizedE: string | null
    return {
      before (ctx) {
        memorizedB = ctx.bem.b
        memorizedE = ctx.bem.els
        ctx.bem.els = null
      },
      after (ctx) {
        ctx.bem.b = memorizedB
        ctx.bem.els = memorizedE
      },
      $ ({ context, props }) {
        arg = typeof arg === 'string' ? arg : arg({ context, props })
        context.bem.b = arg
        return `${props?.bPrefix || _bPrefix}${context.bem.b as string}`
      }
    }
  }

  function e (arg: AvailableSelector): COptionSelector {
    let memorizedE: string | null
    return {
      before (ctx) {
        memorizedE = ctx.bem.els
      },
      after (ctx) {
        ctx.bem.els = memorizedE
      },
      $ ({ context, props }) {
        arg = typeof arg === 'string' ? arg : arg({ context, props })
        context.bem.els = arg.split(',').map(v => v.trim())
        return (context.bem.els as string[])
          .map(el => `${props?.bPrefix || _bPrefix}${context.bem.b as string}__${el}`).join(', ')
      }
    }
  }

  function m (arg: AvailableSelector): COptionSelector {
    return {
      $ ({ context, props }) {
        arg = typeof arg === 'string' ? arg : arg({ context, props })
        const modifiers = arg.split(',').map(v => v.trim())
        function elementToSelector (el?: string): string {
          return modifiers.map(modifier => `&${props?.bPrefix || _bPrefix}${context.bem.b as string}${
            el !== undefined ? `${_ePrefix}${el}` : ''
          }${_mPrefix}${modifier}`).join(', ')
        }
        const els = context.bem.els
        if (els !== null) {
          if (process.env.NODE_ENV !== 'production' && els.length >= 2) {
            throw Error(
              `[css-render/plugin-bem]: m(${arg}) is invalid, using modifier inside multiple elements is not allowed`
            )
          }
          return elementToSelector(els[0])
        } else {
          return elementToSelector()
        }
      }
    }
  }

  function notM (arg: AvailableSelector): COptionSelector {
    return {
      $ ({ context, props }) {
        arg = typeof arg === 'string' ? arg : arg({ context, props })
        const els = context.bem.els as null | string[]
        if (process.env.NODE_ENV !== 'production' && els !== null && els.length >= 2) {
          throw Error(
            `[css-render/plugin-bem]: notM(${arg}) is invalid, using modifier inside multiple elements is not allowed`
          )
        }
        return `&:not(${props?.bPrefix || _bPrefix}${context.bem.b as string}${
          (els !== null && els.length > 0) ? `${_ePrefix}${els[0]}` : ''
        }${_mPrefix}${arg})`
      }
    }
  }

  const cB = ((...args: any[]) => c(b(args[0]), args[1], args[2])) as createCNode<string>
  const cE = ((...args: any[]) => c(e(args[0]), args[1], args[2])) as createCNode<string>
  const cM = ((...args: any[]) => c(m(args[0]), args[1], args[2])) as createCNode<string>
  const cNotM = ((...args: any[]) => c(notM(args[0]), args[1], args[2])) as createCNode<string>

  Object.assign(_plugin, {
    cB, cE, cM, cNotM
  })

  return _plugin as CssRenderBemPlugin
}

export { plugin }
export default plugin
