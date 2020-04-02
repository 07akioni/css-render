import {
  CNodeOptions,
  CNode,
  CProperties,
  CContext,
  CSSRenderInstance
} from './types'
import { render } from './render'

export interface createCNodeForInstance {
  (instance: CSSRenderInstance, $: string | CNodeOptions, children: CNode[]): CNode
  (instance: CSSRenderInstance, $: string | CNodeOptions, props: CProperties | (() => CProperties)): CNode
  (instance: CSSRenderInstance, $: string | CNodeOptions, props: CProperties | (() => CProperties), children: CNode[]): CNode
}

function _r (this: CNode): string {
  return render(this, this.instance)
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
      children: props,
      instance,
      render: _r
    }
  } else if (Array.isArray(children)) {
    return {
      $,
      props,
      children,
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
