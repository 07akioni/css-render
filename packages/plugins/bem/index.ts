/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import {
  CNodeOptions,
  CSSRenderPlugin,
  createCNode
} from 'css-render'

interface BEMPluginOptions {
  blockPrefix?: string
  elementPrefix?: string
  modifierPrefix?: string
}

interface CSSRenderBEMPlugin extends CSSRenderPlugin {
  cB: createCNode
  cE: createCNode
  cM: createCNode
  cNotM: createCNode
}

function plugin (options?: BEMPluginOptions): CSSRenderBEMPlugin {
  let _bPrefix: string = '.'
  let _ePrefix: string = '__'
  let _mPrefix: string = '--'
  let c: createCNode
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
      ctx.bem.elements = null
    }
  }

  function b (arg: string): CNodeOptions {
    let memorizedB: string | null
    let memorizedE: string | null
    return {
      before (ctx) {
        memorizedB = ctx.bem.block
        memorizedE = ctx.bem.elements
        ctx.bem.block = arg
        ctx.bem.elements = null
      },
      after (ctx) {
        ctx.bem.block = memorizedB
        ctx.bem.elements = memorizedE
      },
      $ (ctx) {
        return `${_bPrefix}${ctx.bem.block as string}`
      }
    }
  }

  function e (arg: string): CNodeOptions {
    let memorizedE: string | null
    return {
      before (ctx) {
        if (process.env.NODE_ENV !== 'production' && ctx.bem.elements !== null) {
          throw Error('[css-render/_plugin-bem/e]: nested element is not allowed')
        }
        memorizedE = ctx.bem.elements
        ctx.bem.elements = arg.split(',').map(v => v.trim())
      },
      after (ctx) {
        ctx.bem.elements = memorizedE
      },
      $ (ctx) {
        return (ctx.bem.elements as string[])
          .map(el => `${_bPrefix}${ctx.bem.block as string}__${el}`).join(', ')
      }
    }
  }

  function m (arg: string): CNodeOptions {
    return {
      $ (ctx) {
        const modifiers = arg.split(',').map(v => v.trim())
        function elementToSelector (el?: string): string {
          return modifiers.map(modifier => `&${_bPrefix}${ctx.bem.block as string}${
            el !== undefined ? `${_ePrefix}${el}` : ''
          }${_mPrefix}${modifier}`).join(', ')
        }
        const els = ctx.bem.elements
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

  function notM (arg: string): CNodeOptions {
    return {
      $ (ctx) {
        const els = ctx.bem.elements as null | string[]
        if (process.env.NODE_ENV !== 'production' && els !== null && els.length >= 2) {
          throw Error(
            '[css-render/_plugin-bem/notM]: using modifier inside multiple elements is not allowed'
          )
        }
        return `&:not(${_bPrefix}${ctx.bem.block as string}${
          (els !== null && els.length > 0) ? `${_ePrefix}${els[0]}` : ''
        }${_mPrefix}${arg})`
      }
    }
  }

  const cB = ((...args: any[]) => c(b(args[0]), args[1], args[2])) as createCNode
  const cE = ((...args: any[]) => c(e(args[0]), args[1], args[2])) as createCNode
  const cM = ((...args: any[]) => c(m(args[0]), args[1], args[2])) as createCNode
  const cNotM = ((...args: any[]) => c(notM(args[0]), args[1], args[2])) as createCNode

  Object.assign(_plugin, {
    cB, cE, cM, cNotM
  })

  return _plugin as CSSRenderBEMPlugin
}

export { plugin }
export default plugin
