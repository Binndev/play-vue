import VNode from 'src/vdom/vnode'

export type ComponentOptions = {
  // data
  data: Object | Function | void
  method: { [key: string]: Function }
  props?: string[] | Record<string, Function | Function[] | null | PropOptions>
  watch?: { [key: string]: Function | string }
  computed?: {
    [key: string]:
      | Function
      | {
          get?: Function
          set?: Function
          cache?: boolean
        }
  }
  // dom
  el?: string | Element
  template?: string
  render?: (h: () => VNode) => VNode
}

export type PropOptions = {
  type?: Function | Array<Function> | null
  default?: any
  required?: boolean | null
  validator?: Function | null
}
