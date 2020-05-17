import {
  Properties
} from 'csstype'

export interface CContext {
  [key: string]: any
}

/** render related */
export type CRenderProps = any

export interface CRenderOption {
  context: CContext
  props: CRenderProps
}

/** mount related */
export type MountTarget = HTMLStyleElement | string | number | null | undefined
export interface UnmountOption {
  target?: MountTarget
  delay?: number
  count?: boolean
}

export interface MountOption <T extends MountTarget> {
  target?: T
  props?: CRenderProps
  count?: boolean
}

/** CNode */
export interface CNode {
  $: CSelector
  props: CProperties
  children: CNodeChildren
  instance: CSSRenderInstance
  els: HTMLStyleElement[]
  render: <T extends CRenderProps> (props?: T) => string
  mount: <T extends MountTarget> (options?: MountOption<T>) => (T extends null ? null : HTMLStyleElement)
  unmount: (options?: UnmountOption) => void
}

/** Node Children */
type CNodeLazyChild = (option: CRenderOption) => (CNodePlainChild | CNode)
type CNodePlainChild = CNode | Array<CNode | CNodePlainChild>
export type CNodeChildren = Array<CNodePlainChild | CNodeLazyChild> | null

/** Properties */
export type CProperty = CPlainProperties | string | number | undefined | null
export interface CPlainProperties extends Properties<string | number> {
  [nonPropertyLiteral: string]: CProperty
}
export type CLazyProperties = ((options: {
  context?: CContext
  props?: CRenderProps
}) => CPlainProperties | null | undefined)
export type CProperties = CPlainProperties | CLazyProperties | null | undefined

/** Selector */
export type CStringSelector = string
export type CLazySelector<T = string | null | undefined> = (options: CRenderOption) => T
export interface COptionSelector {
  $?: CLazySelector | CStringSelector | null
  before?: (context: CContext) => any
  after?: (context: CContext) => any
}
export type CSelector = CStringSelector | CLazySelector | COptionSelector | null | undefined
export type CSelectorPath = Array<string | null | undefined>

/** CNode */
export interface createCNode <T = CSelector> {
  (selector: T, props: CProperties, children: CNodeChildren): CNode
  (selector: T, props: CProperties): CNode
  (selector: T, children: CNodeChildren): CNode
  (children: CNodeChildren): CNode
}

export type baseCreateCNodeForCSSRenderInstance = (
  instance: CSSRenderInstance,
  selector: CSelector,
  props: CProperties,
  children: CNodeChildren
) => CNode

export interface createCNodeForCSSRenderInstance extends baseCreateCNodeForCSSRenderInstance {
  (instance: CSSRenderInstance, selector: CSelector, props: CProperties): CNode
  (instance: CSSRenderInstance, selector: CSelector, children: CNodeChildren): CNode
  (instance: CSSRenderInstance, children: CNodeChildren): CNode
}

export interface CSSRenderInstance {
  context: {
    [key: string]: any
  }
  c: createCNode<CSelector>
  use: (plugin: CSSRenderPlugin, ...args: any[]) => void
  config: CSSRenderConfig
}

export interface CSSRenderPlugin {
  install: (instance: CSSRenderInstance, ...args: any[]) => void
}

export interface CSSRenderConfig {
  preserveEmptyBlock: boolean
}
