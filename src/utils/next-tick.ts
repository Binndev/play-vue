import { isNative } from './env'

let callbacks: Array<Function> = []
let pending = false

let timerFunc

if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
  }
} else if (
  typeof MutationObserver !== 'undefined' &&
  isNative(MutationObserver)
) {
  let counter = 1
  const observe = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observe.observe(textNode, {
    characterData: true,
  })

  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

export function nextTick(cb?: (...args: any[]) => any, ctx?: object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      cb.call(ctx)
    } else if (_resolve) {
      _resolve(ctx)
    }
  })

  if (!pending) {
    pending = false
    timerFunc()
  }

  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}

function flushCallbacks() {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0, l = copies.length; i < l; i++) {
    copies[i]()
  }
}
