import {
  CNode,
  CProperties,
  CContext,
  CssRenderInstance,
  createCNodeForCssRenderInstance,
  baseCreateCNodeForCssRenderInstance,
  CRenderProps,
  CSelector,
  CNodeChildren,
  UnmountOption,
  MountOption,
  SsrAdapter
} from './types'
import { render } from './render'
import { mount, unmount } from './mount'

function wrappedRender <T extends CRenderProps> (this: CNode, props?: T): string {
  return render(this, this.instance, props)
}

// do not guard node calling, it should throw an error.
function wrappedMount<T extends undefined | SsrAdapter> (
  this: CNode,
  options: MountOption<T> = {}
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
): T extends undefined ? HTMLStyleElement : void {
  const { target, id, ssr } = options
  const { props, count = false } = options
  const targetElement = mount(
    this.instance,
    this,
    id ?? target,
    props,
    count,
    ssr
  )
  return targetElement as any
}

function wrappedUnmount (
  this: CNode,
  options: UnmountOption = {}
): void {
  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const {
    id,
    target,
    delay = 0,
    count = false
  } = options
  if (delay === 0) unmount(this.instance, this, id ?? target, count)
  else {
    setTimeout(() => unmount(this.instance, this, id ?? target, count), delay)
  }
}

const createCNode: baseCreateCNodeForCssRenderInstance = function (
  instance: CssRenderInstance,
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

export const c: createCNodeForCssRenderInstance = function (
  instance: CssRenderInstance,
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
} as createCNodeForCssRenderInstance

export {
  CNode,
  CProperties,
  CContext
}
