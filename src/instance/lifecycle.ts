import { Component } from 'types/component'
import { VNodeData } from 'types/vnode'
import VNode, { createEmptyVNode, createTextVNode } from 'vdom/vnode'
import { createElementVNode } from 'vdom/vnode'

export function initLifeCycle(Vue: typeof Component) {
  Vue.prototype._update = function () {}
  Vue.prototype._render = function () {
    const vm: Component = this
    return vm.$options.render?.call(vm)
  }
  Vue.prototype._c = function (
    tag?: string,
    vnodeData?: VNodeData,
    ...children: VNode[]
  ) {
    if (!tag) {
      return createEmptyVNode()
    }
    return createElementVNode(this, tag, vnodeData, ...children)
  }
  Vue.prototype._v = function (text?: string) {
    if (!text) {
      return createEmptyVNode()
    }
    return createTextVNode(this, text)
  }
  Vue.prototype._s = function (value: any) {
    return value
  }
}

export function mountComponent(vm: Component, el: Element) {
  // 1. 调用render方法产生虚拟DOM
  const vdom = vm._render()!
  console.log(vdom)
  // 2. 根据虚拟DOM产生真实DOM
  // vm._update(vdom)
  // 3.插入到el元素中
}
