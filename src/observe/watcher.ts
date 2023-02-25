import { Component } from 'types/component'
import { isFunction, nextTick } from 'utils'
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
  user?: boolean
  cb: Function
  _depId: Set<number>
  constructor(
    vm: Component,
    exprOrFn: string | (() => any),
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
    if (isFunction(exprOrFn)) {
      this.getter = exprOrFn // getter 意味着调用这个函数可以发生取值操作
    } else {
      // exprOrFn 为字符串
      this.getter = function () {
        return this[exprOrFn]
      }
    }
    this.user = !!options?.user
    this.renderWatcher = !!isRenderWatcher
    this.cb = fn
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
    return this.value
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
    // 计算属性更新，就将值改为脏值
    if (this.lazy) {
      this.dirty = true
    } else {
      queueWatcher(this)
    }
  }

  run() {
    const oldValue = this.value
    const newValue = this.get()
    if (this.user) {
      this.cb.call(this.vm, newValue, oldValue)
    }
  }

  // 计算属性添加依赖
  depend() {
    let l = this.deps.length
    while (l--) {
      this.deps[l].depend() //计算属性依赖的dep收集渲染watcher
    }
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
