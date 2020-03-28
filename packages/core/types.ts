export interface CSelector {
  beforeEnter?: Function
  afterLeave?: Function
  selector: () => string
}

export interface CNode {
  path: string | CSelector
  properties: CProperties | null
  children: CNode[] | null
}

export interface CProperties {
  [propertyName: string]: string
}
