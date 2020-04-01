import {
  Properties
} from 'csstype'

export interface CContext {
  [key: string]: any
}

export interface CSelector {
  before?: (context: CContext) => any
  after?: (context: CContext) => any
  $: (context: CContext) => string
}

export interface CNode {
  path: string | CSelector
  props: CProperties | null
  children: CNode[] | null
  instance: CSSRenderInstance
  render: () => string
}

export type CProperty = CProperties | string | number | undefined

export interface CProperties extends Properties<string | number> {
  [nonPropertyLiteral: string]: CProperty | (() => CProperty)
}

export interface createCNode {
  (path: string | CSelector): CNode
  (path: string | CSelector, children: CNode[]): CNode
  (path: string | CSelector, props: CProperties): CNode
  (path: string | CSelector, props: CProperties, children: CNode[]): CNode
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
