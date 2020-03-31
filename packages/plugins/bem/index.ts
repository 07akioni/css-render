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

export default function CSSRenderBEMPlugin (options?: BEMPluginOptions): CSSRenderPlugin {
  let _bPrefix: string = '.'
  let _ePrefix: string = '__'
  let _mPrefix: string = '--'
  let h: createCNode

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
      h = instance.h
      instance.context.bem = {}
      instance.context.bem.block = null
      instance.context.bem.elements = null
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
      selector (ctx) {
        return `${_bPrefix}${ctx.bem.block as string}`
      }
    }
  }

  function e (arg: string): CSelector {
    let memorizedE: string | null
    return {
      before (ctx) {
        if (process.env.NODE_ENV !== 'production' && ctx.bem.elements !== null) {
          throw Error('[css-render/plugin-bem/e]: nested element is not allowed')
        }
        memorizedE = ctx.bem.elements
        ctx.bem.elements = arg.split(',').map(v => v.trim())
      },
      after (ctx) {
        ctx.bem.elements = memorizedE
      },
      selector (ctx) {
        return (ctx.bem.elements as string[])
          .map(el => `${_bPrefix}${ctx.bem.block as string}__${el}`).join(', ')
      }
    }
  }

  function m (arg: string): CSelector {
    return {
      selector (ctx) {
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
              '[css-render/plugin-bem/m]: using modifier inside multiple elements is not allowed'
            )
          }
          return elementToSelector(els[0])
        } else {
          return elementToSelector()
        }
      }
    }
  }

  const notM = function (arg: string): CSelector {
    return {
      selector (ctx) {
        const els = ctx.bem.elements as null | string[]
        if (process.env.NODE_ENV !== 'production' && els !== null && els.length >= 2) {
          throw Error(
            '[css-render/plugin-bem/notM]: using modifier inside multiple elements is not allowed'
          )
        }
        return `&:not(${_bPrefix}${ctx.bem.block as string}${
          (els !== null && els.length > 0) ? `${_ePrefix}${els[0]}` : ''
        }${_mPrefix}${arg})`
      }
    }
  }

  const hB = ((...a: any[]) => h(b(a[0]), a[1], a[2])) as createCNode
  const hE = ((...a: any[]) => h(e(a[0]), a[1], a[2])) as createCNode
  const hM = ((...a: any[]) => h(m(a[0]), a[1], a[2])) as createCNode
  const hNotM = ((...a: any[]) => h(notM(a[0]), a[1], a[2])) as createCNode

  Object.assign(plugin, {
    b, e, m, notM, hB, hE, hM, hNotM
  })

  return plugin
}
