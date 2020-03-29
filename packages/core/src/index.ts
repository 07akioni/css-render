import {
  CSelector,
  CNode,
  CProperties
} from './types'
import { context } from './context'
import { render } from './render'

interface createCNode {
  (path: string | CSelector): CNode
  (path: string | CSelector, children: CNode[]): CNode
  (path: string | CSelector, properties: CProperties): CNode
  (path: string | CSelector, properties: CProperties, children: CNode[]): CNode
}

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

export { context }
export { render }
