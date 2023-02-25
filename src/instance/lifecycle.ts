import Watcher from 'observe/watcher'
import { Component } from 'types/component'
import { VNodeData } from 'types/vnode'
import { isPlainObject, nextTick, noop } from 'utils'
import { patch } from 'vdom/patch'
import VNode, { createEmptyVNode, createTextVNode } from 'vdom/vnode'
import { createElementVNode } from 'vdom/vnode'

export function initLifeCycle(Vue: typeof Component) {
  Vue.prototype._update = function (vnode: VNode) {
    const el = this.$el
    this.$el = patch(el, vnode)
  }
  Vue.prototype.$nextTick = function (fn: (...args: any[]) => any) {
    return nextTick(fn, this)
  }
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
    if (!isPlainObject(value)) {
      return value
    }
    return JSON.stringify(value)
  }
}

export function mountComponent(vm: Component, el: Element) {
  vm.$el = el
  // 1. 调用render方法产生虚拟DOM
  // 2. 根据虚拟DOM产生真实DOM
  // 3.插入到el元素中

  const updateComponent = () => {
    vm._update(vm._render()!)
  }
  new Watcher(vm, updateComponent, noop, null, true)
  callHook(vm, 'mounted')
}

export function callHook(vm: Component, hook: string) {
  const handlers = vm.$options[hook]
  if (handlers) {
    handlers.forEach(handler => handler())
  }
}
