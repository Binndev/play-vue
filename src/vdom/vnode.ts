import { Component } from 'types/component'
import { VNodeComponentOptions, VNodeData } from 'types/vnode'
import { isOriginTag, isUndef } from 'utils'

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
  componentOptions?: VNodeComponentOptions
  componentInstance?: Component

  constructor(
    tag?: string,
    data?: VNodeData,
    children?: Array<VNode>,
    context?: Component,
    text?: string,
    componentOptions?: VNodeComponentOptions
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.context = context
    this.key = data && data.key
    this.isComment = false
    this.componentOptions = componentOptions
  }
}

export function createElementVNode(
  vm: Component,
  tag?: string,
  data?: VNodeData,
  ...children: VNode[]
) {
  if (!tag || isOriginTag(tag)) {
    return new VNode(tag, data, children, vm)
  } else {
    // 创建组件的虚拟节点
    const Ctor = vm.$options.components?.[tag]
    return createComponent(vm, tag, data, children, Ctor)
  }
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

export function isSameVnode(newVNode: VNode, oldVNode: VNode) {
  return newVNode.tag === oldVNode.tag && newVNode.key === oldVNode.key
}

export function createComponent(
  vm: Component,
  tag: string,
  data?: VNodeData,
  children?: Array<VNode>,
  Ctor?: Function | Object
) {
  if (isUndef(Ctor)) {
    return
  }
  if (typeof Ctor === 'object') {
    Ctor = vm.$options._base.extend(Ctor)
  }
  if (data == null) {
    data = {}
  }
  data.hook = {
    init(vnode: VNode) {
      const instance = new vnode.componentOptions!.Ctor()
      vnode.componentInstance = instance
      instance.$mount()
    },
  }

  return new VNode(tag, data, children, vm, undefined, {
    Ctor: Ctor as typeof Component,
  })
}
