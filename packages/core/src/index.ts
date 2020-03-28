import {
  CSelector,
  CNode,
  CProperties
} from './types'

import parseSelectorPath from './parseSelectorPath'

import { context } from './context'

interface createCNode {
  (path: string | CSelector): CNode
  (path: string | CSelector, children: CNode[]): CNode
  (path: string | CSelector, properties: CProperties): CNode
  (path: string | CSelector, properties: CProperties, children: CNode[]): CNode
}

export { context }

export const h: createCNode = function (
  path: any,
  properties: any,
  children: any
) {
  if (properties === undefined) {
    return {
      path,
      properties: null,
      children: null
    }
  } else if (Array.isArray(properties)) {
    return {
      path,
      properties: null,
      children: properties
    }
  } else {
    return {
      path,
      properties,
      children
    }
  }
} as createCNode

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
  styles: string[]
): void {
  if (
    node.properties === null &&
    (
      node.children === null ||
      node.children.length === 0
    )
  ) return
  if (typeof node.path === 'string') {
    const selector = parseSelectorPath(paths)
    const style = createStyle(selector, node.properties)
    if (style !== null) styles.push(style)
    if (node.children !== null) {
      node.children.forEach(childNode => {
        traverse(childNode, paths, styles)
      })
    }
  } else {
    if (node.path.beforeEnter !== undefined) node.path.beforeEnter(context)
    paths.push(node.path.selector(context))
    const selector = parseSelectorPath(paths)
    const style = createStyle(selector, node.properties)
    if (style !== null) styles.push(style)
    if (node.children !== null) {
      node.children.forEach(childNode => {
        traverse(childNode, paths, styles)
      })
    }
    paths.pop()
    if (node.path.afterLeave !== undefined) node.path.afterLeave(context)
  }
}

export function render (node: CNode): string {
  const styles: string[] = []
  traverse(node, [], styles)
  return styles.join('\n')
}
