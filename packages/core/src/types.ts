export interface CContext {
  [key: string]: any
}

export interface CSelector {
  before?: (context: CContext) => any
  after?: (context: CContext) => any
  selector: (context: CContext) => string
}

export interface CNode {
  path: string | CSelector
  props: CProperties | null
  children: CNode[] | null
  instance: CSSRenderInstance
  render: () => string
}

export interface CProperties {
  [propertyName: string]: string | number | (() => string | number)
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
  [key: string]: any
}

export interface CSSRenderConfig {
  preserveEmptyBlock: boolean
}
