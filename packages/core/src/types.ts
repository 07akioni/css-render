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

/** find related */
export type CFindTarget = (target: string | number) => HTMLStyleElement | null

/** CNode */
export interface CNode {
  $: CSelector
  props: CProperties
  children: CNodeChildren
  instance: CssRenderInstance
  els: HTMLStyleElement[]
  render: <T extends CRenderProps> (props?: T) => string
  mount: <T extends MountTarget> (options?: MountOption<T>) => (T extends null ? null : HTMLStyleElement)
  unmount: (options?: UnmountOption) => void
}

/** Node Children */
type CNodeLazyChild = (option: CRenderOption) => (CNodePlainChild | CNode | null | undefined)
type CNodePlainChild = CNode | string | Array<CNode | CNodePlainChild | null | undefined>
export type CNodeChildren = Array<CNodePlainChild | CNodeLazyChild | null | undefined> | null

/** Properties */
export type CProperty = CPlainProperties | string | number | undefined | null
export interface CPlainProperties extends Properties<string | number> {
  raw?: string
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

export type baseCreateCNodeForCssRenderInstance = (
  instance: CssRenderInstance,
  selector: CSelector,
  props: CProperties,
  children: CNodeChildren
) => CNode

export interface createCNodeForCssRenderInstance extends baseCreateCNodeForCssRenderInstance {
  (instance: CssRenderInstance, selector: CSelector, props: CProperties): CNode
  (instance: CssRenderInstance, selector: CSelector, children: CNodeChildren): CNode
  (instance: CssRenderInstance, children: CNodeChildren): CNode
}

export interface CssRenderInstance {
  context: {
    [key: string]: any
  }
  c: createCNode<CSelector>
  use: (plugin: CssRenderPlugin, ...args: any[]) => void
  find: CFindTarget
  config: CssRenderConfig
}

export interface CssRenderPlugin {
  install: (instance: CssRenderInstance, ...args: any[]) => void
}

export interface CssRenderConfig {
  keepEmptyBlock?: boolean
}
