/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import {
  COptionSelector,
  CLazySelector,
  CStringSelector,
  CSSRenderPlugin,
  createCNode,
  CSelector
} from 'css-render'

interface BEMPluginOptions {
  blockPrefix?: string
  elementPrefix?: string
  modifierPrefix?: string
}

type AvailableSelector = CStringSelector | CLazySelector<string>

interface CSSRenderBEMPlugin extends CSSRenderPlugin {
  cB: createCNode<AvailableSelector>
  cE: createCNode<AvailableSelector>
  cM: createCNode<AvailableSelector>
  cNotM: createCNode<AvailableSelector>
}

function plugin (options?: BEMPluginOptions): CSSRenderBEMPlugin {
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

  const _plugin: CSSRenderPlugin = {
    install (instance) {
      c = instance.c
      const ctx = instance.context
      ctx.bem = {}
      ctx.bem.block = null
      ctx.bem.bDepth = 0
      ctx.bem.elements = null
    }
  }

  function b (arg: AvailableSelector): COptionSelector {
    let memorizedB: string | null
    let memorizedE: string | null
    return {
      before (ctx) {
        ctx.bem.bDepth++
        memorizedB = ctx.bem.block
        memorizedE = ctx.bem.elements
        ctx.bem.elements = null
      },
      after (ctx) {
        ctx.bem.bDepth--
        ctx.bem.block = memorizedB
        ctx.bem.elements = memorizedE
      },
      $ ({ context, props }) {
        arg = typeof arg === 'string' ? arg : arg({ context, props })
        context.bem.block = arg
        return `${_bPrefix}${context.bem.block as string}`
      }
    }
  }

  function e (arg: AvailableSelector): COptionSelector {
    let memorizedE: string | null
    return {
      before (ctx) {
        memorizedE = ctx.bem.elements
      },
      after (ctx) {
        ctx.bem.elements = memorizedE
      },
      $ ({ context, props }) {
        arg = typeof arg === 'string' ? arg : arg({ context, props })
        context.bem.elements = arg.split(',').map(v => v.trim())
        return (context.bem.elements as string[])
          .map(el => `${_bPrefix}${context.bem.block as string}__${el}`).join(', ')
      }
    }
  }

  function m (arg: AvailableSelector): COptionSelector {
    return {
      $ ({ context, props }) {
        arg = typeof arg === 'string' ? arg : arg({ context, props })
        const modifiers = arg.split(',').map(v => v.trim())
        function elementToSelector (el?: string): string {
          return modifiers.map(modifier => `&${_bPrefix}${context.bem.block as string}${
            el !== undefined ? `${_ePrefix}${el}` : ''
          }${_mPrefix}${modifier}`).join(', ')
        }
        const els = context.bem.elements
        if (els !== null) {
          if (process.env.NODE_ENV !== 'production' && els.length >= 2) {
            throw Error(
              '[css-render/_plugin-bem/m]: using modifier inside multiple elements is not allowed'
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
        const els = context.bem.elements as null | string[]
        if (process.env.NODE_ENV !== 'production' && els !== null && els.length >= 2) {
          throw Error(
            '[css-render/_plugin-bem/notM]: using modifier inside multiple elements is not allowed'
          )
        }
        return `&:not(${_bPrefix}${context.bem.block as string}${
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

  return _plugin as CSSRenderBEMPlugin
}

export { plugin }
export default plugin
