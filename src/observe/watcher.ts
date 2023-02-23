import { Component } from 'types/component'
import { nextTick } from 'utils'
import Dep, { popTarget, pushTarget } from './dep'

/**
 * 一个属性对应一个dep
 * 一个视图对应一个watcher
 * 一个属性可能对应多个视图，一个视图可能对应多个属性
 * watcher和dep属于多对多的关系
 */

export interface WatcherOptions {
  lazy?: boolean
  user?: boolean
  sync?: boolean
}

let id = 0 //watcher的唯一标识
class Watcher {
  vm: Component
  value: any
  id: number
  getter: Function
  renderWatcher: boolean //标识渲染watcher
  lazy: boolean
  dirty: boolean
  deps: Dep[]
  _depId: Set<number>
  constructor(
    vm: Component,
    fn: Function,
    options: WatcherOptions | null,
    isRenderWatcher?: boolean
  ) {
    if (options) {
      this.lazy = !!options.lazy
    } else {
      this.lazy = false
    }
    this.id = id++
    this.getter = fn // getter 意味着调用这个函数可以发生取值操作
    this.renderWatcher = !!isRenderWatcher
    this.vm = vm
    this.deps = [] // 实现计算属性、组件卸载时使用
    this._depId = new Set()
    this.dirty = this.lazy
    !this.lazy && this.get()
  }

  evaluate() {
    this.get()
    this.dirty = false
  }

  get() {
    pushTarget(this)
    this.value = this.getter.call(this.vm)
    popTarget()
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
    queueWatcher(this)
  }

  run() {
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
      nextTick(flushScheduleQueue)
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
