import VNode from 'src/vdom/vnode'
import { Component } from './component'

export type ComponentOptions = {
  // data
  data: Object | Function | void
  methods: { [key: string]: Function }
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
  // render?: (h: () => VNode) => VNode
  render?: () => VNode

  // asset
  components?: { [key: string]: Component }

  // private
  _base: typeof Component
}

export type PropOptions = {
  type?: Function | Array<Function> | null
  default?: any
  required?: boolean | null
  validator?: Function | null
}
