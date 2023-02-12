import { def, hasOwn } from 'src/utils'

export function observe(data: any) {
  if (typeof data !== 'object' || data == null) {
    return data
  }
  //已经观测过的直接返回观测的对象
  if (data && hasOwn(data, '__ob__') && data.__ob__ instanceof Observer) {
    return data.__ob__
  }

  return new Observer(data)
}

class Observer {
  constructor(value) {
    def(value, '__ob__', this, false) //数组可以通过__ob__调用observeArray方法
    if (Array.isArray(value)) {
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk(data) {
    const keys = Object.keys(data)
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i]
      const value = data[key]
      definedReactive(data, key, value)
    }
  }

  observeArray(data) {
    data.forEach(item => observe(item))
  }
}

function definedReactive(data, key, value) {
  observe(value)
  Object.defineProperty(data, key, {
    get() {
      console.log('获取')
      return value
    },
    set(newVal) {
      console.log('设置')
      if (newVal === value) return

      observe(newVal)
      value = newVal
    },
  })
}
