import {
  CNode,
  CProperties,
  CNodeOptions,
  CSSRenderInstance,
  CProperty
} from './types'
import { p$p } from './parse'

/** kebab regex */
const _kr = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g

/** kebab case */
function _kc (pattern: string): string {
  return pattern.replace(_kr, match => '-' + match.toLowerCase())
}

/** _upwrap property */
/** TODO: refine it */
function _up (prop: CProperty, indent: string = '  '): string {
  if (typeof prop === 'object') {
    return (
      ' {\n' +
      Object.entries(prop).map(v => {
        return indent + `  ${_kc(v[0])}: ${v[1] as string};`
      }).join('\n') +
      '\n' + indent + '}'
    )
  }
  return `: ${String(prop)};`
}

/** create style */
function _cs (
  selector: string,
  props: CProperties | null,
  instance: CSSRenderInstance
): string | null {
  if (props === null) return null
  const propertyNames = Object.keys(props)
  if (propertyNames.length === 0) {
    if (instance.config.preserveEmptyBlock) return selector + ' {}'
    return null
  }
  const statements = [
    selector + ' {'
  ]
  propertyNames.forEach(propertyName => {
    const property = props[propertyName]
    propertyName = _kc(propertyName)
    if (property !== undefined) {
      statements.push(`  ${propertyName}${_up(property)}`)
    }
  })
  statements.push('}')
  return statements.join('\n')
}

/** traverse */
function t (
  node: CNode,
  selectorPaths: Array<string | CNodeOptions>,
  styles: string[],
  instance: CSSRenderInstance
): void {
  if (typeof node.$ === 'string') {
    selectorPaths.push(node.$)
  } else if (node.$.$ !== undefined) {
    if (node.$.before !== undefined) node.$.before(instance.context)
    selectorPaths.push(node.$.$(instance.context))
  }
  const selector = p$p(selectorPaths, instance)
  const style = _cs(selector, node.props, instance)
  if (style !== null) styles.push(style)
  if (node.children !== null) {
    node.children.forEach(childNode => {
      t(childNode, selectorPaths, styles, instance)
    })
  }
  selectorPaths.pop()
  if (!(typeof node.$ === 'string') && node.$.after !== undefined) node.$.after(instance.context)
}

export function render (node: CNode, instance: CSSRenderInstance): string {
  const styles: string[] = []
  t(node, [], styles, instance)
  return styles.join('\n\n')
}
