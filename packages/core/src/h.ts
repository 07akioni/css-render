import {
  CNodeOptions,
  CNode,
  CProperties,
  CContext,
  CSSRenderInstance,
  CNodeChildren
} from './types'
import { render } from './render'

export interface createCNodeForInstance {
  (instance: CSSRenderInstance, $: string | CNodeOptions, children: CNodeChildren): CNode
  (instance: CSSRenderInstance, $: string | CNodeOptions, props: CProperties): CNode
  (instance: CSSRenderInstance, $: string | CNodeOptions, props: CProperties, children: CNodeChildren): CNode
}

function _r (this: CNode): string {
  return render(this, this.instance)
}

function _t (children: CNodeChildren, flattenedNodes: CNode[]): void {
  children.forEach(child => {
    if (Array.isArray(child)) {
      _t(child, flattenedNodes)
    } else {
      flattenedNodes.push(child)
    }
  })
}

/** flatten */
function _f (children: CNodeChildren): CNode[] {
  const flattenedNodes: CNode[] = []
  _t(children, flattenedNodes)
  return flattenedNodes
}

export const h: createCNodeForInstance = function (
  instance: CSSRenderInstance,
  $: any,
  props: any,
  children: any
) {
  if (Array.isArray(props)) {
    return {
      $,
      props: null,
      children: _f(props),
      instance,
      render: _r
    }
  } else if (Array.isArray(children)) {
    return {
      $,
      props,
      children: _f(children),
      instance,
      render: _r
    }
  } else {
    return {
      $,
      props,
      children: null,
      instance,
      render: _r
    }
  }
} as createCNodeForInstance

export {
  CNodeOptions,
  CNode,
  CProperties,
  CContext
}
