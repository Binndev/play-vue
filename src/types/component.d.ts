import VNode from 'vdom/vnode'
import { ComponentOptions } from './options'
import { VNodeData } from './vnode'

export declare class Component {
  constructor(options?: any)

  // public property
  $options: ComponentOptions

  // public method
  // $mount: (el?: Element | void) => Component & { [key: string]: any }
  $mount: (el?: Element | string) => void

  // life circle
  _init: Function
  _update: (vnode: VNode) => void
  _mount: (el?: Element) => Component

  // rendering
  _render: () => VNode

  _c: (vnode?: VNode, vnodeData?: VNodeData) => VNode | void
  _v: (value?: string | number) => VNode
  _s: (value: any) => string

  // private property
  _data: Record<string, any>
}
