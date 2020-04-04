import {
  Properties
} from 'csstype'

export interface CContext {
  [key: string]: any
}

export interface CNodeOptions {
  before?: (context: CContext) => any
  after?: (context: CContext) => any
  $: (context: CContext) => string
}

export type LazyCProperties = ((options?: {
  context?: CContext
  props?: any
}) => CProperties)

export interface CNode {
  $: string | CNodeOptions
  props: CProperties | LazyCProperties | null
  children: CNode[] | null
  instance: CSSRenderInstance
  els: HTMLStyleElement[]
  render: (props?: any) => string
  mount: (options?: { target?: HTMLStyleElement | string | number, props?: any }) => HTMLStyleElement
  unmount: (options?: { target?: HTMLStyleElement | string | number }) => void
}

export type CProperty = CProperties | string | number | undefined

export interface CProperties extends Properties<string | number> {
  [nonPropertyLiteral: string]: CProperty
}

export type CNodeChildren = Array<CNode | CNodeChildren>

export interface createCNode {
  (children: CNodeChildren): CNode
  (selector: string | CNodeOptions, children: CNodeChildren): CNode
  (selector: string | CNodeOptions, props: CProperties | LazyCProperties): CNode
  (selector: string | CNodeOptions, props: CProperties | LazyCProperties, children: CNodeChildren): CNode
}

export interface createCNodeForCSSRenderInstance {
  (instance: CSSRenderInstance, children: CNodeChildren): CNode
  (instance: CSSRenderInstance, $: string | CNodeOptions, children: CNodeChildren): CNode
  (instance: CSSRenderInstance, $: string | CNodeOptions, props: CProperties | LazyCProperties): CNode
  (instance: CSSRenderInstance, $: string | CNodeOptions, props: CProperties | LazyCProperties, children: CNodeChildren): CNode
}

export interface CSSRenderInstance {
  context: {
    [key: string]: any
  }
  id: string
  c: createCNode
  use: (plugin: CSSRenderPlugin, ...args: any[]) => void
  config: CSSRenderConfig
}

export interface CSSRenderPlugin {
  install: (instance: CSSRenderInstance, ...args: any[]) => void
}

export interface CSSRenderConfig {
  preserveEmptyBlock: boolean
}
