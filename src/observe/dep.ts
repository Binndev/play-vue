export interface DepTarget {
  id: number
  addDep(dep: Dep): void
  update(): void
}

const pendingCleanupDep: Dep[] = []

export function cleanupDep() {
  for (let i = 0, l = pendingCleanupDep.length; i < l; i++) {
    const dep = pendingCleanupDep[i]
    dep.subs = dep.subs.filter(s => s)
    dep._pending = false
  }
}

let id = 0
// 负责收集watcher
class Dep {
  static target: DepTarget | null
  id: number
  subs: Array<DepTarget | null>
  _pending: boolean
  constructor() {
    this.id = id++
    this.subs = []
    this._pending = false
  }
  depend() {
    Dep.target?.addDep(this) //当前watcher记住当前dep
    // this.subs.push(Dep.target)
  }

  addSub(watcher: DepTarget) {
    this.subs.push(watcher)
  }

  removeSub(sub: DepTarget) {
    // dep清除watcher比较费时，所以放在下一个watcher
    this.subs[this.subs.indexOf(sub)] = null
    if (!this._pending) {
      this._pending = true
      pendingCleanupDep.push(this)
    }
  }

  notify() {
    this.subs.forEach(watcher => watcher?.update())
  }
}

Dep.target = null

let stack: Array<DepTarget> = []

export function pushTarget(watcher: DepTarget) {
  stack.push(watcher)
  Dep.target = watcher
}

export function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}

export default Dep
