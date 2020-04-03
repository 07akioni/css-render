import {
  CNodeOptions,
  CNode,
  CProperties,
  CContext,
  CSSRenderInstance,
  CNodeChildren
} from './types'
import { render } from './render'
import { mount } from './mount'
import { _qe, _re } from './utils'

export interface createCNodeForInstance {
  (instance: CSSRenderInstance, $: string | CNodeOptions, children: CNodeChildren): CNode
  (instance: CSSRenderInstance, $: string | CNodeOptions, props: CProperties): CNode
  (instance: CSSRenderInstance, $: string | CNodeOptions, props: CProperties, children: CNodeChildren): CNode
}

/** render wrapper */
function _r (this: CNode): string {
  return render(this, this.instance)
}

/** mount wrapper */
function _m (this: CNode, target?: HTMLStyleElement | string | number): HTMLStyleElement {
  const targetElement = mount(this.instance, this, target)
  const els = this.els
  if (!els.includes(targetElement)) {
    els.push(targetElement)
  }
  return targetElement
}

/** unmount */
function _um (this: CNode, target?: HTMLStyleElement | string | number): void {
  const els = this.els
  if (target === undefined) {
    els.forEach(_re)
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
): CNode {
  if (Array.isArray(props)) {
    return {
      $,
      props: null,
      children: _f(props),
      instance,
      els: [],
      render: _r,
      mount: _m,
      unmount: _um
    }
  } else if (Array.isArray(children)) {
    return {
      $,
      props,
      children: _f(children),
      instance,
      els: [],
      render: _r,
      mount: _m,
      unmount: _um
    }
  } else {
    return {
      $,
      props,
      children: null,
      instance,
      els: [],
      render: _r,
      mount: _m,
      unmount: _um
    }
  }
} as createCNodeForInstance

export {
  CNodeOptions,
  CNode,
  CProperties,
  CContext
}
