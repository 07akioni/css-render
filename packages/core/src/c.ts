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
import { mount, unmount } from './mount'

function wrappedRender <T extends CRenderProps> (this: CNode, props?: T): string {
  return render(this, this.instance, props)
}

const inNode = typeof window === 'undefined'

function wrappedMount <T extends MountTarget = MountTarget> (
  this: CNode,
  options?: MountOption<T>
): (T extends null ? null : HTMLStyleElement) {
  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (inNode) return null as (T extends null ? null : HTMLStyleElement)
  // eslint-disable-next-line
  const target = options && options.target
  if (target === null) return null as (T extends null ? null : HTMLStyleElement)
  // eslint-disable-next-line
  const props = options && options.props
  // eslint-disable-next-line
  const count = !((options && options.count) === false)
  const targetElement = mount(
    this.instance,
    this,
    target as (HTMLStyleElement | string | number | undefined),
    props,
    count
  )
  return targetElement as (T extends null ? null : HTMLStyleElement)
}

function wrappedUnmount (
  this: CNode,
  options?: UnmountOption
): void {
  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (inNode) return
  // eslint-disable-next-line
  const target = options && options.target
  // eslint-disable-next-line
  const delay = (options && options.delay) || 0
  // eslint-disable-next-line
  const count = !((options && options.count) === false)
  if (target === null) return
  if (delay === 0) unmount(this.instance, this, target, count)
  else {
    setTimeout(() => unmount(this.instance, this, target, count), delay)
  }
}

const createCNode: baseCreateCNodeForCSSRenderInstance = function (
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
    render: wrappedRender,
    mount: wrappedMount,
    unmount: wrappedUnmount
  }
}

export const c: createCNodeForCSSRenderInstance = function (
  instance: CSSRenderInstance,
  $: any,
  props: any,
  children: any
): CNode {
  if (Array.isArray($)) {
    return createCNode(instance, { $: null }, null, $)
  } if (Array.isArray(props)) {
    return createCNode(instance, $, null, props)
  } else if (Array.isArray(children)) {
    return createCNode(instance, $, props, children)
  } else {
    return createCNode(instance, $, props, null)
  }
} as createCNodeForCSSRenderInstance

export {
  CNode,
  CProperties,
  CContext
}
