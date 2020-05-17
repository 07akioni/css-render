import {
  CNode,
  CProperties,
  CSSRenderInstance,
  CProperty,
  CPlainProperties,
  CRenderProps,
  CNodeChildren,
  CRenderOption,
  SelectorPath
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
  if (typeof prop === 'object' && prop !== null) {
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
  props: CProperties,
  instance: CSSRenderInstance,
  params: T
): CPlainProperties | undefined | null {
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
  props: CProperties,
  instance: CSSRenderInstance,
  params: T
): string | null {
  if (props === null) return null
  // eslint-disable-next-line
  const unwrappedProps = _ups(props, instance, params) || {}
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
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (property !== null && property !== undefined) {
      statements.push(`  ${propertyName}${_up(property)}`)
    }
  })
  statements.push('}')
  return statements.join('\n')
}

/** traverse with callback */
function tc (children: CNodeChildren, options: CRenderOption, callback: (node: CNode) => any): void {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!children) return
  children.forEach(child => {
    if (Array.isArray(child)) {
      tc(child, options, callback)
    } else if (typeof child === 'function') {
      const grandChildren = child(options)
      if (Array.isArray(grandChildren)) {
        tc(grandChildren, options, callback)
      } else {
        callback(grandChildren)
      }
    } else {
      callback(child)
    }
  })
}

/** traverse */
function t <T extends CRenderProps> (
  node: CNode,
  selectorPaths: SelectorPath,
  styles: string[],
  instance: CSSRenderInstance,
  params: T
): void {
  const $ = node.$
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!$ || typeof $ === 'string') {
    // as a string selector
    selectorPaths.push($)
  } else if (typeof $ === 'function') {
    // as a lazy selector
    selectorPaths.push($({
      context: instance.context,
      props: params
    }))
  } else { // as a option selector
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if ($.before) $.before(instance.context)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!$.$ || typeof $.$ === 'string') {
      selectorPaths.push($.$)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    } else if ($.$) {
      selectorPaths.push($.$({
        context: instance.context,
        props: params
      }))
    }
  }
  const selector = p$p(selectorPaths)
  const style = _cs(selector, node.props, instance, params)
  if (style !== null) styles.push(style)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (node.children) {
    tc(node.children, {
      context: instance.context,
      props: params
    }, childNode => {
      t(childNode, selectorPaths, styles, instance, params)
    })
  }
  selectorPaths.pop()
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (typeof $ === 'object' && $ && $.after) $.after(instance.context)
}

export function render <T extends CRenderProps> (node: CNode, instance: CSSRenderInstance, props?: T): string {
  const styles: string[] = []
  t(node, [], styles, instance, props)
  return styles.join('\n\n')
}
