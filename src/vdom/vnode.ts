import { Component } from 'types/component'
import { VNodeData } from 'types/vnode'

// ast 做的是语法层面的转化，描述语法本身
// 虚拟dom，描述的是dom元素，可以增加一些自定义属性
export default class VNode {
  tag?: string
  data?: VNodeData
  key?: string | number | undefined
  children?: Array<VNode>
  text?: string
  context?: Component
  isComment?: boolean
  el?: Element

  constructor(
    tag?: string,
    data?: VNodeData,
    children?: Array<VNode>,
    context?: Component,
    text?: string
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.context = context
    this.key = data && data.key
    this.isComment = false
  }
}

export function createElementVNode(
  vm: Component,
  tag?: string,
  data?: VNodeData,
  ...children: VNode[]
) {
  return new VNode(tag, data, children, vm)
}

export function createTextVNode(vm: Component, text?: string) {
  return new VNode(undefined, undefined, undefined, vm, text)
}

export function createEmptyVNode(text: string = '') {
  const node = new VNode()
  node.text = text
  node.isComment = true

  return node
}
