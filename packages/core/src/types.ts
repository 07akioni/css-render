import { CSSRenderInstance } from './CSSRender'

export interface CContext {
  [key: string]: any
}

export interface CSelector {
  beforeEnter?: (context: CContext) => any
  afterLeave?: (context: CContext) => any
  selector: (context: CContext) => string
}

export interface CNode {
  path: string | CSelector
  properties: CProperties | null
  children: CNode[] | null
  instance: CSSRenderInstance
  render: () => string
}

export interface CProperties {
  [propertyName: string]: string | number | (() => string | number)
}
