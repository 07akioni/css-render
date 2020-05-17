import {
  CNode,
  CProperties,
  CContext,
  CSSRenderInstance,
  createCNodeForCSSRenderInstance,
  baseCreateCNodeForCSSRenderInstance,
  CRenderProps,
  CSelector,
  CNodeChildren,
  UnmountOption,
  MountOption,
  MountTarget
} from './types'
import { render } from './render'
import { _m, _u } from './mount'

/** render wrapper */
function _r <T extends CRenderProps> (this: CNode, props?: T): string {
  return render(this, this.instance, props)
}

/** wrapped mount */
function _wm <T extends MountTarget = MountTarget> (
  this: CNode,
  options?: MountOption<T>
): (T extends null ? null : HTMLStyleElement) {
  // eslint-disable-next-line
  const target = options && options.target
  if (target === null) return null as (T extends null ? null : HTMLStyleElement)
  // eslint-disable-next-line
  const props = options && options.props
  // eslint-disable-next-line
  const count = !((options && options.count) === false)
  const targetElement = _m(
    this.instance,
    this,
    target as (HTMLStyleElement | string | number | undefined),
    props,
    count
  )
  const els = this.els
  if (!els.includes(targetElement)) {
    els.push(targetElement)
  }
  return targetElement as (T extends null ? null : HTMLStyleElement)
}

/** wrapped unmount */
function _wu (
  this: CNode,
  options?: UnmountOption
): void {
  // eslint-disable-next-line
  const target = options && options.target
  // eslint-disable-next-line
  const delay = (options && options.delay) || 0
  // eslint-disable-next-line
  const count = !((options && options.count) === false)
  if (target === null) return
  if (delay === 0) _u(this.instance, this, target, count)
  else {
    setTimeout(() => _u(this.instance, this, target, count), delay)
  }
}

/** create CNode */
const _cc: baseCreateCNodeForCSSRenderInstance = function (
  instance: CSSRenderInstance,
  $: CSelector,
  props: CProperties,
  children: CNodeChildren
): CNode {
  return {
    instance,
    $,
    props,
    children,
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
    return _cc(instance, { $: null }, null, $)
  } if (Array.isArray(props)) {
    return _cc(instance, $, null, props)
  } else if (Array.isArray(children)) {
    return _cc(instance, $, props, children)
  } else {
    return _cc(instance, $, props, null)
  }
} as createCNodeForCSSRenderInstance

export {
  CNode,
  CProperties,
  CContext
}
