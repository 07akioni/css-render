import {
  CNode,
  CProperties,
  CSelector
} from './types'
import { CSSRenderInstance } from './CSSRender'
import { parseSelectorPath } from './parse'

const kebabRegex = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g

function kebabCase (pattern: string): string {
  return pattern.replace(kebabRegex, function (match) {
    return '-' + match.toLowerCase()
  })
}

function createStyle (selector: string, properties: CProperties | null): string | null {
  if (properties === null) return null
  const statements = [
    selector + ' {'
  ]
  Object.keys(properties).forEach(propertyName => {
    const property = properties[propertyName]
    const unwrappedProperty: string = String(typeof property === 'function' ? property() : property)
    propertyName = kebabCase(propertyName)
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
    paths.push(node.path)
    const selector = parseSelectorPath(paths, instance)
    const style = createStyle(selector, node.properties)
    if (style !== null) styles.push(style)
    if (node.children !== null) {
      node.children.forEach(childNode => {
        traverse(childNode, paths, styles, instance)
      })
    }
    paths.pop()
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
