import {
  CSelector,
  CNode,
  CProperties,
  CContext,
  CSSRenderInstance
} from './types'
import { render } from './render'

export interface createCNodeInstance {
  (instance: CSSRenderInstance, path: string | CSelector): CNode
  (instance: CSSRenderInstance, path: string | CSelector, children: CNode[]): CNode
  (instance: CSSRenderInstance, path: string | CSelector, props: CProperties): CNode
  (instance: CSSRenderInstance, path: string | CSelector, props: CProperties, children: CNode[]): CNode
}

function _r (this: CNode): string {
  return render(this, this.instance)
}

export const h: createCNodeInstance = function (
  instance: CSSRenderInstance,
  path: any,
  props: any,
  children: any
) {
  if (props === undefined) {
    return {
      path,
      props: null,
      children: null,
      instance,
      render: _r
    }
  } else if (Array.isArray(props)) {
    return {
      path,
      props: null,
      children: props,
      instance,
      render: _r
    }
  } else {
    if (Array.isArray(children)) {
      return {
        path,
        props,
        children,
        instance,
        render: _r
      }
    } else {
      return {
        path,
        props,
        children: null,
        instance,
        render: _r
      }
    }
  }
} as createCNodeInstance

export {
  CSelector,
  CNode,
  CProperties,
  CContext
}
