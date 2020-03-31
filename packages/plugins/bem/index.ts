/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import {
  CSelector,
  CSSRenderPlugin,
  createCNode
} from 'css-render'

interface BEMPluginOptions {
  blockPrefix?: string
  elementPrefix?: string
  modifierPrefix?: string
}

interface CSSRenderBEMPlugin extends CSSRenderPlugin {
  b: CSelector
  e: CSelector
  m: CSelector
  notM: CSelector
  hB: createCNode
  hE: createCNode
  hM: createCNode
  hNotM: createCNode
}

function plugin (options?: BEMPluginOptions): CSSRenderBEMPlugin {
  let _bPrefix: string = '.'
  let _ePrefix: string = '__'
  let _mPrefix: string = '--'
  let h: createCNode
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
      h = instance.h
      const ctx = instance.context
      ctx.bem = {}
      ctx.bem.block = null
      ctx.bem.elements = null
    }
  }

  function b (arg: string): CSelector {
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

  function e (arg: string): CSelector {
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

  function m (arg: string): CSelector {
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

  function notM (arg: string): CSelector {
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

  const hB = ((...args: any[]) => h(b(args[0]), args[1], args[2])) as createCNode
  const hE = ((...args: any[]) => h(e(args[0]), args[1], args[2])) as createCNode
  const hM = ((...args: any[]) => h(m(args[0]), args[1], args[2])) as createCNode
  const hNotM = ((...args: any[]) => h(notM(args[0]), args[1], args[2])) as createCNode

  Object.assign(_plugin, {
    b, e, m, notM, hB, hE, hM, hNotM
  })

  return _plugin as CSSRenderBEMPlugin
}

export { plugin }
export default plugin
