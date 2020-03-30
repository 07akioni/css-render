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

function createStyle (
  selector: string,
  properties: CProperties | null,
  instance: CSSRenderInstance
): string | null {
  if (properties === null) {
    return null
  }
  const propertyNames = Object.keys(properties)
  if (propertyNames.length === 0) {
    if (instance.config.preserveEmptyBlock) return selector + ' {}'
    return null
  }
  const statements = [
    selector + ' {'
  ]
  propertyNames.forEach(propertyName => {
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
  const pathIsString = typeof node.path === 'string'
  if (pathIsString) paths.push(node.path)
  else {
    if ((node.path as CSelector).beforeEnter !== undefined) ((node.path as CSelector).beforeEnter as Function)(instance.context)
    paths.push((node.path as CSelector).selector(instance.context))
  }
  const selector = parseSelectorPath(paths, instance)
  const style = createStyle(selector, node.properties, instance)
  if (style !== null) styles.push(style)
  if (node.children !== null) {
    node.children.forEach(childNode => {
      traverse(childNode, paths, styles, instance)
    })
  }
  paths.pop()
  if (!pathIsString && (node.path as CSelector).afterLeave !== undefined) ((node.path as CSelector).afterLeave as Function)(instance.context)
}

export function render (node: CNode, instance: CSSRenderInstance): string {
  const styles: string[] = []
  traverse(node, [], styles, instance)
  return styles.join('\n')
}
