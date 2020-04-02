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

export interface CNode {
  $: string | CNodeOptions
  props: CProperties | null
  children: CNode[] | null
  instance: CSSRenderInstance
  render: () => string
}

export type CProperty = CProperties | string | number | undefined

export interface CProperties extends Properties<string | number> {
  [nonPropertyLiteral: string]: CProperty
}

export interface createCNode {
  (selector: string | CNodeOptions, children: CNode[]): CNode
  (selector: string | CNodeOptions, props: CProperties | (() => CProperties)): CNode
  (selector: string | CNodeOptions, props: CProperties | (() => CProperties), children: CNode[]): CNode
}

export interface CSSRenderInstance {
  context: {
    [key: string]: any
  }
  id: string
  h: createCNode
  mount: (nodes: CNode[] | CNode, id: string | number) => HTMLStyleElement
  use: (plugin: CSSRenderPlugin, ...args: any[]) => void
  config: CSSRenderConfig
}

export interface CSSRenderPlugin {
  install: (instance: CSSRenderInstance, ...args: any[]) => void
}

export interface CSSRenderConfig {
  preserveEmptyBlock: boolean
}
