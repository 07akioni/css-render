import {
  CSelector,
  CNode,
  CProperties
} from '@/types'

import parseSelectorPath from '@/parseSelectorPath'

interface createCNode {
  (path: string | CSelector): CNode
  (path: string | CSelector, children: CNode[]): CNode
  (path: string | CSelector, properties: CProperties): CNode
  (path: string | CSelector, properties: CProperties, children: CNode[]): CNode
}

export const h: createCNode = function (path, properties, children) {
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
    statements.push(`  ${propertyName}: ${properties[propertyName]};`)
  })
  statements.push('}')
  return statements.join('\n')
}

function traverse (
  node: CNode,
  paths: Array<string | CSelector>,
  styles: string[]
): string {
  if (
    node.properties === null &&
    (
      node.children === null ||
      node.children.length === 0
    )
  ) return ''
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
    if (node.path.beforeEnter !== undefined) node.path.beforeEnter()
    paths.push(node.path.selector())
    const selector = parseSelectorPath(paths)
    const style = createStyle(selector, node.properties)
    if (style !== null) styles.push(style)
    if (node.children !== null) {
      node.children.forEach(childNode => {
        traverse(childNode, paths, styles)
      })
    }
    paths.pop()
    if (node.path.afterLeave !== undefined) node.path.afterLeave()
  }
}

export function render (node: CNode): string {
  const styles = []
  traverse(node, [], styles)
  return styles.join('\n')
}
