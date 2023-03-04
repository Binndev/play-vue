import VNode from 'vdom/vnode'
import { ComponentOptions } from './options'
import { VNodeData } from './vnode'
import { GlobalApi } from './global-api'

export declare class Component {
  constructor(options?: any)
  static options: Record<string, any>
  static mixin: (mixin: Object) => any
  static extend: GlobalApi['extend']

  // public property
  $options: ComponentOptions
  $el: Element

  // public method
  // $mount: (el?: Element | void) => Component & { [key: string]: any }
  $mount: (el?: Element | string) => void
  $nextTick: (fn: (...args: any[]) => any, ctx?: object) => void | Promise<any>
  $watch: (
    expOrFn: string | (() => any),
    cb: Function,
    options?: Record<string, any>
  ) => Function
  // life circle
  _init: Function
  _update: (vnode: VNode) => void
  _mount: (el?: Element) => Component

  // rendering
  _render: () => VNode | undefined

  _c: (tag?: string, vnodeData?: VNodeData) => VNode | void
  _v: (value?: string) => VNode
  _s: (value: any) => string

  // private property
  _data: Record<string, any>
  _computedWatchers: Record<string, any>
  _vnode: VNode
}
