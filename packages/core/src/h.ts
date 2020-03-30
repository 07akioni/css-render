import {
  CSelector,
  CNode,
  CProperties,
  CContext
} from './types'
import { CSSRenderInstance } from './CSSRender'
import { render } from './render'

export interface createInstanceCNode {
  (instance: CSSRenderInstance, path: string | CSelector): CNode
  (instance: CSSRenderInstance, path: string | CSelector, children: CNode[]): CNode
  (instance: CSSRenderInstance, path: string | CSelector, properties: CProperties): CNode
  (instance: CSSRenderInstance, path: string | CSelector, properties: CProperties, children: CNode[]): CNode
}

function _render (this: CNode): string {
  return render(this, this.instance)
}

export const h: createInstanceCNode = function (
  instance: CSSRenderInstance,
  path: any,
  properties: any,
  children: any
) {
  if (properties === undefined) {
    return {
      path,
      properties: null,
      children: null,
      instance,
      render: _render
    }
  } else if (Array.isArray(properties)) {
    return {
      path,
      properties: null,
      children: properties,
      instance,
      render: _render
    }
  } else {
    if (Array.isArray(children)) {
      return {
        path,
        properties,
        children,
        instance,
        render: _render
      }
    } else {
      return {
        path,
        properties,
        children: null,
        instance,
        render: _render
      }
    }
  }
} as createInstanceCNode

export {
  CSelector,
  CNode,
  CProperties,
  CContext
}
