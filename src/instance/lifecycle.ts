import { Component } from 'types/component'
import { VNodeData } from 'types/vnode'
import VNode from 'vdom/vnode'
import { createElementVNode } from 'vdom/vnode'

export function initLifeCycle(Vue: typeof Component) {
  Vue.prototype._update = function () {}
  Vue.prototype._render = function () {
    const vm: Component = this
    return vm.$options.render?.call(vm)
  }
  Vue.prototype._c = function (vnode?: VNode, vnodeData?: VNodeData) {
    return createElementVNode(vm)
  }
  Vue.prototype._v = function () {}
  Vue.prototype._s = function (value: any) {
    return JSON.stringify(value)
  }
}

export function mountComponent(vm: Component, el: Element) {
  // 1. 调用render方法产生虚拟DOM
  // 2. 根据虚拟DOM产生真实DOM
  // 3.插入到el元素中
}
