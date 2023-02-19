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
    // this.get()
    queueWatcher(this)
  }

  run() {
    console.log('run')
    this.get()
  }
}

// 异步更新
let queue: Watcher[] = []
let has = {}
let pending = false
function queueWatcher(watcher: Watcher) {
  const id = watcher.id
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true

    // 不管update执行多少次，最终只执行一次
    if (!pending) {
      setTimeout(flushScheduleQueue, 0)
      pending = true
    }
  }
}

function flushScheduleQueue() {
  const flushQueue = queue.slice(0)
  queue = []
  has = {}
  pending = false
  flushQueue.forEach(q => q.run())
}

export default Watcher