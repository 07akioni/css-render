import {
  CNodeOptions,
  CNode,
  CProperties,
  CContext,
  CSSRenderInstance,
  createCNodeForCSSRenderInstance,
  CNodeChildren
} from './types'
import { render } from './render'
import { _m, _u } from './mount'

/** render wrapper */
function _r (this: CNode, props?: any): string {
  return render(this, this.instance, props)
}

/** wrapped mount */
function _wm (
  this: CNode,
  options?: {
    target?: HTMLStyleElement | string | number | null
    props?: any
  }
): HTMLStyleElement | null {
  const target = options === undefined ? undefined : options.target
  if (target === null) return null
  const targetElement = _m(
    this.instance,
    this,
    target,
    options?.props
  )
  const els = this.els
  if (!els.includes(targetElement)) {
    els.push(targetElement)
  }
  return targetElement
}

/** wrapped _u */
function _wu (this: CNode, options?: { target?: HTMLStyleElement | string | number | null }): void {
  const target = options === undefined ? undefined : options.target
  if (target === null) return
  _u(this.instance, this, target)
}

/** traverse */
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
function _f (children: CNodeChildren | null): CNode[] | null {
  if (children === null) return null
  const flattenedNodes: CNode[] = []
  _t(children, flattenedNodes)
  return flattenedNodes
}

/** create CNode */
function _cc (instance: CSSRenderInstance, $: any, props: any, children: any): CNode {
  return {
    instance,
    $,
    props,
    children: _f(children),
    els: [],
    render: _r,
    mount: _wm,
    unmount: _wu
  }
}

export const c: createCNodeForCSSRenderInstance = function (
  instance: CSSRenderInstance,
  $: any,
  props: any,
  children: any
): CNode {
  if (Array.isArray($)) {
    return _cc(instance, '', null, $)
  } if (Array.isArray(props)) {
    return _cc(instance, $, null, props)
  } else if (Array.isArray(children)) {
    return _cc(instance, $, props, children)
  } else {
    return _cc(instance, $, props, null)
  }
} as createCNodeForCSSRenderInstance

export {
  CNodeOptions,
  CNode,
  CProperties,
  CContext
}
