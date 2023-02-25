import { nextTick } from 'utils'
import { cleanupDep } from './dep'
import Watcher from './watcher'

let queue: Watcher[] = []
let has = {}
let pending = false
export function queueWatcher(watcher: Watcher) {
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
  cleanupDep()
}
