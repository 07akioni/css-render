import {
  CNode,
  CProperties,
  CSelector
} from './types'
import { CSSRenderInstance } from './CSSRender'
import { parseSelectorPath } from './parse'

function createStyle (selector: string, properties: CProperties | null): string | null {
  if (properties === null) return null
  const statements = [
    selector + ' {'
  ]
  Object.keys(properties).forEach(propertyName => {
    const property = properties[propertyName]
    const unwrappedProperty: string = typeof property === 'function' ? property() : property
    statements.push(`  ${propertyName}: ${unwrappedProperty};`)
  })
  statements.push('}')
  return statements.join('\n')
}

function traverse (
  node: CNode,
  paths: Array<string | CSelector>,
  styles: string[],
  instance: CSSRenderInstance
): void {
  if (
    node.properties === null &&
    (
      node.children === null ||
      node.children.length === 0
    )
  ) return
  if (typeof node.path === 'string') {
    const selector = parseSelectorPath(paths, instance)
    const style = createStyle(selector, node.properties)
    if (style !== null) styles.push(style)
    if (node.children !== null) {
      node.children.forEach(childNode => {
        traverse(childNode, paths, styles, instance)
      })
    }
  } else {
    if (node.path.beforeEnter !== undefined) node.path.beforeEnter(instance.context)
    paths.push(node.path.selector(instance.context))
    const selector = parseSelectorPath(paths, instance)
    const style = createStyle(selector, node.properties)
    if (style !== null) styles.push(style)
    if (node.children !== null) {
      node.children.forEach(childNode => {
        traverse(childNode, paths, styles, instance)
      })
    }
    paths.pop()
    if (node.path.afterLeave !== undefined) node.path.afterLeave(instance.context)
  }
}

export function render (node: CNode, instance: CSSRenderInstance): string {
  const styles: string[] = []
  traverse(node, [], styles, instance)
  return styles.join('\n')
}
