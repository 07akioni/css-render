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
import { mount } from './mount'
import { _qe, _re } from './utils'

/** render wrapper */
function _r (this: CNode): string {
  return render(this, this.instance)
}

/** is node */
const _in: boolean = typeof document === 'undefined'

/** mount wrapper */
function _m (this: CNode, target?: HTMLStyleElement | string | number): HTMLStyleElement | null {
  if (_in) return null
  const targetElement = mount(this.instance, this, target)
  const els = this.els
  if (!els.includes(targetElement)) {
    els.push(targetElement)
  }
  return targetElement
}

/** unmount */
function _um (this: CNode, target?: HTMLStyleElement | string | number): void {
  if (_in) return
  const els = this.els
  if (target === undefined) {
    els.forEach(_re)
    this.els = []
  } else if (typeof target === 'string' || typeof target === 'number') {
    const targetElement = _qe(target)
    this.els = els.filter(el => el !== targetElement)
    _re(targetElement)
  } else {
    this.els = els.filter(el => el !== target)
    _re(target)
  }
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
    mount: _m,
    unmount: _um
  }
}

export const h: createCNodeForCSSRenderInstance = function (
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
