export interface CSelector {
  beforeEnter?: Function;
  afterLeave?: Function;
  selector: () => string;
}

export interface CNode {
  path: string | CSelector;
  properties: object | null;
  children: Array<CNode> | null;
}
