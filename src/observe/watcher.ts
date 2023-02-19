import { Component } from 'types/component'
import Dep from './dep'

/**
 * 一个属性对应一个dep
 * 一个视图对应一个watcher
 * 一个属性可能对应多个视图，一个视图可能对应多个属性
 * watcher和dep属于多对多的关系
 */

let id = 0 //watcher的唯一标识
class Watcher {
  id: number
  getter: Function
  renderWatch: boolean //标识渲染watcher
  deps: Dep[]
  _depId: Set<number>
  constructor(vm: Component, fn: Function, options) {
    this.id = id++
    this.getter = fn // getter 意味着调用这个函数可以发生取值操作
    this.renderWatch = options
    this.deps = [] // 实现计算属性、组件卸载时使用
    this._depId = new Set()
    this.get()
  }

  get() {
    Dep.target = this
    this.getter()
    Dep.target = null
  }

  addDep(dep: Dep) {
    const id = dep.id
    if (!this._depId.has(id)) {
      this.deps.push(dep)
      dep.addSub(this)
      this._depId.add(id)
    }
  }

  update() {
    this.get()
  }
}

export default Watcher
