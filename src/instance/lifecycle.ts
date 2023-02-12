import { Component } from 'types/component'

export function mountComponent(vm: Component, el: Element) {
  // 1. 调用render方法产生虚拟DOM
  // 2. 根据虚拟DOM产生真实DOM
  // 3.插入到el元素中
}
