import {
  CSelector,
  CNode
} from './types'

import parseSelectorPath from './parseSelectorPath'

interface createCNode {
  (path: string | CSelector): CNode,
  (path: string | CSelector, children: Array<CNode>): CNode,
  (path: string | CSelector, properties: Object): CNode,
  (path: string | CSelector, properties: Object, children: Array<CNode>): CNode;
}

export const h: createCNode = <createCNode>function (path, properties, children) {
  if (!properties) {
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
}

function createStyle (selector: string, properties: object | null): string | null {
  if (!properties) return null
  const statements = [
    selector + ' {',
  ]
  Object.keys(properties).forEach(propertyName => {
    statements.push(`${propertyName}: ${properties[propertyName]};`)
  })
  statements.push('}')
  return statements.join('\n')
}

function traverse (node: CNode, paths: Array<string | CSelector>, styles: Array<string>): string {
  if (!node.properties || !node.children || !node.children.length) return ''
  if (typeof node.path === 'string') {
    paths.push(node.path)
    paths.pop()
    const selector = parseSelectorPath(paths)
    const style = createStyle(selector, node.properties)
    if (style) styles.push(style)
    node.children && node.children.forEach(childNode => {
      traverse(childNode, paths, styles)
    })
  } else {
    if (node.path.beforeEnter) node.path.beforeEnter()
    paths.push(node.path.selector())
    const selector = parseSelectorPath(paths)
    const style = createStyle(selector, node.properties)
    if (style) styles.push(style)
    node.children && node.children.forEach(childNode => {
      traverse(childNode, paths, styles)
    })
    paths.pop()
    if (node.path.afterLeave) node.path.afterLeave()
  }
}

export function render (node: CNode) {
  const styles = []
  traverse(node, [], styles)
  return styles.join('\n')
}