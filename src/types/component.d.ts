import VNode from 'vdom/vnode'
import { ComponentOptions } from './options'
import { VNodeData } from './vnode'

export declare class Component {
  constructor(options?: any)

  // public property
  $options: ComponentOptions
  $el: Element

  // public method
  // $mount: (el?: Element | void) => Component & { [key: string]: any }
  $mount: (el?: Element | string) => void

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
}
