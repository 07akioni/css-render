import {
  Properties
} from 'csstype'

export interface CContext {
  [key: string]: any
}

export type CRenderProps = any

export interface CRenderOption {
  context: CContext
  props: CRenderProps
}

export type CSelector = (options: CRenderOption) => string

export interface CNodeOptions {
  $: CSelector | string
  before?: (context: CContext) => any
  after?: (context: CContext) => any
}

export type CLazyProperties = ((options: {
  context?: CContext
  props?: CRenderProps
}) => CProperties)

export interface CNode {
  $: string | CSelector |CNodeOptions
  props: CProperties | CLazyProperties | null
  children: CNodeChildren
  instance: CSSRenderInstance
  els: HTMLStyleElement[]
  render: <T extends CRenderProps> (props?: T) => string
  mount: <T extends HTMLStyleElement | string | number | null |undefined, V extends CRenderProps> (options?: { target?: T, props?: V }) => (T extends null ? null : HTMLStyleElement)
  unmount: (options?: { target?: HTMLStyleElement | string | number | null | undefined }) => void
}

type CLazyChildren = (option: CRenderOption) => CNodeChildren | CNode

export type CProperty = CProperties | string | number | undefined

export interface CProperties extends Properties<string | number> {
  [nonPropertyLiteral: string]: CProperty
}

export type CNodeChildren = Array<CNode | CNodeChildren | CLazyChildren>

export interface createCNode <T> {
  (selector: T, props: CProperties | CLazyProperties, children: CNodeChildren): CNode
  (selector: T, props: CProperties | CLazyProperties): CNode
  (selector: T, children: CNodeChildren): CNode
  (children: CNodeChildren): CNode
}

export interface createCNodeForCSSRenderInstance {
  (instance: CSSRenderInstance, selector: string | CSelector | CNodeOptions, props: CProperties | CLazyProperties, children: CNodeChildren): CNode
  (instance: CSSRenderInstance, selector: string | CSelector | CNodeOptions, props: CProperties | CLazyProperties): CNode
  (instance: CSSRenderInstance, selector: string | CSelector | CNodeOptions, children: CNodeChildren): CNode
  (instance: CSSRenderInstance, children: CNodeChildren): CNode
}

export interface CSSRenderInstance {
  context: {
    [key: string]: any
  }
  c: createCNode<string | CSelector | CNodeOptions>
  use: (plugin: CSSRenderPlugin, ...args: any[]) => void
  config: CSSRenderConfig
}

export interface CSSRenderPlugin {
  install: (instance: CSSRenderInstance, ...args: any[]) => void
}

export interface CSSRenderConfig {
  preserveEmptyBlock: boolean
}
