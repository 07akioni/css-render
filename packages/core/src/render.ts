import {
  CNode,
  CProperties,
  CSSRenderInstance,
  CProperty,
  CRenderProps,
  CLazyProperties
} from './types'
import { p$p } from './parse'

/** kebab regex */
const _kr = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g

/** kebab case */
function _kc (pattern: string): string {
  return pattern.replace(_kr, match => '-' + match.toLowerCase())
}

/** upwrap property */
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

/** unwrap properties */
function _ups <T extends CRenderProps> (
  props: CProperties | CLazyProperties,
  instance: CSSRenderInstance,
  params: T
): CProperties {
  if (typeof props === 'function') {
    return props({
      context: instance.context,
      props: params
    })
  }
  return props
}

/** create style */
function _cs <T extends CRenderProps> (
  selector: string,
  props: CProperties | CLazyProperties | null,
  instance: CSSRenderInstance,
  params: T
): string | null {
  if (props === null) return null
  const unwrappedProps = _ups(props, instance, params)
  const propertyNames = Object.keys(unwrappedProps)
  if (propertyNames.length === 0) {
    if (instance.config.preserveEmptyBlock) return selector + ' {}'
    return null
  }
  const statements = [
    selector + ' {'
  ]
  propertyNames.forEach(propertyName => {
    const property = unwrappedProps[propertyName]
    propertyName = _kc(propertyName)
    if (property !== undefined) {
      statements.push(`  ${propertyName}${_up(property)}`)
    }
  })
  statements.push('}')
  return statements.join('\n')
}

/** traverse */
function t <T extends CRenderProps> (
  node: CNode,
  selectorPaths: string[],
  styles: string[],
  instance: CSSRenderInstance,
  params: T
): void {
  if (typeof node.$ === 'string') {
    selectorPaths.push(node.$)
  } else {
    if (node.$.before !== undefined) node.$.before(instance.context)
    if (typeof node.$.$ === 'string') {
      selectorPaths.push(node.$.$)
    } else {
      selectorPaths.push(node.$.$({
        context: instance.context,
        props: params
      }))
    }
  }
  const selector = p$p(selectorPaths, instance)
  const style = _cs(selector, node.props, instance, params)
  if (style !== null) styles.push(style)
  if (node.children !== null) {
    node.children.forEach(childNode => {
      t(childNode, selectorPaths, styles, instance, params)
    })
  }
  selectorPaths.pop()
  if (!(typeof node.$ === 'string') && node.$.after !== undefined) node.$.after(instance.context)
}

export function render <T extends CRenderProps> (node: CNode, instance: CSSRenderInstance, props?: T): string {
  const styles: string[] = []
  t(node, [], styles, instance, props)
  return styles.join('\n\n')
}
