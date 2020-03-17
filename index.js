const parsePath = require('./parsePath')
const { b, e, m, notM } = require('./mixin')

function h (selector, properties, children = []) {
  if (Array.isArray(properties)) {
    children = properties
    properties = {}
  }
  const CNode = {
    __CNode__: true,
    entries: []
  }
  const entries = CNode.entries
  
  Object.keys(properties).length && entries.push({
    path: selector,
    properties
  })
  children.forEach(node => {
    node.entries.forEach(childEntry => {
      entries.push({
        path: [selector].concat(childEntry.path),
        properties: childEntry.properties
      })
    })
  })
  return CNode
}

function baseStringifyCNode (CNode) {
  const lines  = []
  for (const entry of CNode.entries) {
    lines.push(parsePath(entry.path) + ' {')
    Object.keys(entry.properties).forEach(property => {
      lines.push('  ' + property + ': ' + entry.properties[property] + ';')
    })
    lines.push('}\n')
  }
  return lines.join('\n')
}

function stringifyCNode (input) {
  if (Array.isArray(input)) {
    return input.map(CNode => stringifyCNode(CNode)).join('\n')
  }
  return baseStringifyCNode(input)
}

//
const colors = {
  info: '$info-color',
  success: '$success-color',
  warning: '$warning-color',
  error: '$error-color'
}

function typedButtonIconCSS (type) {
  const typedColor = colors[type]
  return h(e('icon'), [
    h(b('icon'), {
      fill: typedColor + '-active',
      stroke: typedColor + '-active'
    }),
    h(b('base-loading'), {
      fill: typedColor + '-active',
      stroke: typedColor + '-active',
    })
  ])
}

function typedButtonCSS (type) {
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

console.log(stringifyCNode(typedButtonCSS('error')))
// console.log(JSON.stringify(typedButtonCSS('error'), 0, 2))