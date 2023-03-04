import VNode from 'vdom/vnode'
import { Component } from './component'

export type VNodeData = {
  key?: string | number
  slot?: string
  ref?: string
  is?: string
  pre?: boolean
  tag?: string
  staticClass?: string
  class?: any
  staticStyle?: { [key: string]: any }
  style?: string | Array<Object> | Object
  hook?: { [key: string]: Function }
}

export type VNodeComponentOptions = {
  Ctor: typeof Component
  propsData?: Object
  children?: Array<VNode>
  tag?: string
}
