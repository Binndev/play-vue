import Dep from 'observe/dep'
import Watcher from 'observe/watcher'
import { observe } from 'src/observe'
import { Component } from 'types/component'
import {
  hasOwn,
  isFunction,
  isPlainObject,
  isReversed,
  isString,
  noop,
} from 'utils'

const sharedPropertyDefinition = {
  configurable: true,
  enumberable: true,
  get: noop,
  set: noop,
}

export function proxy(target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val
  }

  Object.defineProperty(target, key, sharedPropertyDefinition)
}

export function initState(vm: Component) {
  const opts = vm.$options
  if (opts.props) {
    initProps()
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
  if (opts.methods) {
    initMethod(vm)
  }
}

function initProps() {}

function initData(vm: Component) {
  let data: any = vm.$options.data
  data = typeof data === 'function' ? getData(data, vm) : data || {}
  vm._data = data
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (methods && hasOwn(methods, key)) {
      console.warn(
        'Method "${key}" has already been defined as a data property'
      )
    } else if (props && hasOwn(props, key)) {
      console.warn('The data property "${key}" is already declared as a prop.')
    } else if (!isReversed(key)) {
      proxy(vm, '_data', key)
    }
  }
  observe(data)
}

function initMethod(vm: Component) {
  const methods = vm.$options.methods
  for (const key in methods) {
    const method = methods[key]
    vm[key] = typeof method === 'function' ? method.bind(vm) : noop
  }
}

function initComputed(vm: Component) {
  const computed = vm.$options.computed as Object
  // 定义计算属性watcher并挂载到vm上
  const watchers = (vm._computedWatchers = Object.create(null))
  for (const key in computed) {
    const userDef = computed[key]
    const getter = isFunction(userDef) ? userDef : userDef.get
    watchers[key] = new Watcher(vm, getter || noop, noop, { lazy: true })
    defineComputed(vm, key, userDef)
  }
}

function initWatch(vm: Component) {
  const watch = vm.$options.watch
  for (const key in watch) {
    // handler 可能是数组、函数、字符串、对象（里面有个handler方法）等
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0, j = handler.length; i < j; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}

function createWatcher(
  vm: Component,
  expOrFn: string | (() => any),
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (isString(handler)) {
    handler = vm[handler]
  }

  return vm.$watch(expOrFn, handler, options)
}

function getData(data: Function, vm: Component): any {
  data.call(vm, vm)
}

function defineComputed(
  vm: Component,
  key: string,
  userDef: Record<string, any> | (() => any)
) {
  if (!isFunction(userDef)) {
    sharedPropertyDefinition.set = userDef.set || noop
  }
  sharedPropertyDefinition.get = createComputedGetter(key)

  Object.defineProperty(vm, key, sharedPropertyDefinition)
}

function createComputedGetter(key: string) {
  return function () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher.dirty) {
      watcher.evaluate()
    }
    // 计算属性出栈后 队列里还存在渲染watcher，此时需要让计算属性中的属性添加渲染watcher
    if (Dep.target) {
      watcher.depend()
    }
    return watcher.value
  }
}
