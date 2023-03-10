/**
 * 给属性增加一个依赖收集器dep
 * 页面渲染时，将渲染逻辑封装到watcher中，调用vm_update(vm._render())进行重新渲染
 * 将watcher收集进dep中
 */
import { def, hasOwn, hasProto, isPlainObject } from 'src/utils'
import { arrayMethods, arrayProto } from './array'
import Dep from './dep'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

export function observe(data: any) {
  //已经观测过的直接返回观测的对象
  if (data && hasOwn(data, '__ob__') && data.__ob__ instanceof Observer) {
    return data.__ob__
  }

  if (Array.isArray(data) || isPlainObject(data)) {
    return new Observer(data)
  }
}

class Observer {
  dep: Dep
  constructor(value) {
    this.dep = new Dep()
    def(value, '__ob__', this, false) //数组可以通过__ob__调用observeArray方法
    if (Array.isArray(value)) {
      if (hasProto) {
        // @ts-ignore
        value.__proto__ = arrayProto
      } else {
        for (let i = 0, l = arrayKeys.length; i < l; i++) {
          const key = arrayKeys[i]
          def(value, key, arrayMethods[key])
        }
      }
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
  const childOb = observe(value)
  let dep = new Dep()
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set(newVal) {
      if (newVal === value) return
      observe(newVal)
      value = newVal
      dep.notify()
    },
  })
}

function dependArray(value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    if (e?.__ob__) {
      e.__ob__.dep.depend()
    }
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
