import { CSSRender, CNode } from 'css-render'
import CSSRenderBEMPlugin from '@css-render/plugins/bem/index'

const cssr = CSSRender()
const plugin = CSSRenderBEMPlugin()
cssr.use(plugin)
const {
  h
} = cssr
const {
  b, e, m, notM
} = plugin

type colorType = 'info' | 'success' | 'warning' | 'error'

const colors = {
  info: '$info-color',
  success: '$success-color',
  warning: '$warning-color',
  error: '$error-color'
}

function typedButtonIconCSS (type: colorType): CNode {
  const typedColor = colors[type]
  return h(e('icon'), [
    h(b('icon'), {
      fill: typedColor + '-active',
      stroke: typedColor + '-active'
    }),
    h(b('base-loading'), {
      fill: typedColor + '-active',
      stroke: typedColor + '-active'
    })
  ])
}

function typedButtonCSS (type: colorType): CNode {
  const typedColor = colors[type]
  return h(b('button'), [
    h(m(`${type}-type`), {
      color: typedColor,
      backgroundColor: typedColor,
      border: `1px solid ${typedColor}`
    }, [
      h(m('ghost', 'text'), {
        color: typedColor,
        backgroundColor: typedColor,
        border: `1px solid ${typedColor}`
      }, [
        h(notM('disabled'), [
          h('&.n-button--enter-pressed', {
            backgroundColor: typedColor + '-active',
            color: typedColor + '-active'
          }, [
            h('n-button__border-mask', {
              boxShadow: typedColor
            }),
            typedButtonIconCSS(type)
          ]),
          h('&:not(:active):focus', [
            h(notM('enter-pressed'), [
              h(e('border-mask'), {
                boxShadow: typedColor
              }),
              typedButtonIconCSS(type)
            ])
          ]),
          h(notM('enter-pressed'), [
            h('&:hover', {
              backgroundColor: typedColor + '-active',
              color: typedColor + '-active'
            }, [
              h(e('border-mask'), {
                boxShadow: typedColor
              }),
              typedButtonIconCSS(type)
            ]),
            h('&:active', {
              backgroundColor: typedColor + '-active',
              color: typedColor + '-active'
            }, [
              h(e('border-mask'), {
                boxShadow: typedColor
              }),
              typedButtonIconCSS(type)
            ])
          ])
        ]),
        typedButtonIconCSS(type)
      ])
    ])
  ])
}

// console.log(render(typedButtonCSS('error')))
console.log(h(b('block'),
  [h(e('element'), {
    position: 'relative'
  }, [])]
).render())
// console.log(JSON.stringify(h(b('block'),
//   [h(e('element'), {
//     position: 'relative'
//   }, [])]
// ), 0, 2))
