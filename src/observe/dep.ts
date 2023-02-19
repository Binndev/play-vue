export interface DepTarget {
  id: number
  addDep(dep: Dep): void
  update(): void
}

let id = 0
// 负责收集watcher
class Dep {
  static target: DepTarget | null
  id: number
  subs: Array<DepTarget | null>
  constructor() {
    this.id = id++
    this.subs = []
  }
  depend() {
    Dep.target?.addDep(this) //当前watcher记住当前dep
    // this.subs.push(Dep.target)
  }

  addSub(watcher: DepTarget) {
    this.subs.push(watcher)
  }

  notify() {
    this.subs.forEach(watcher => watcher?.update())
  }
}

Dep.target = null

export default Dep
