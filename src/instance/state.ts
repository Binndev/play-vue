import Watcher from 'observe/watcher'
import { observe } from 'src/observe'
import { Component } from 'types/component'
import { hasOwn, isReversed, noop } from 'utils'

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
    initWatch()
  }
  if (opts.method) {
    initMethod
  }
}

function initProps() {}

function initData(vm: Component) {
  let data: any = vm.$options.data
  data = typeof data === 'function' ? getData(data, vm) : data || {}
  vm._data = data
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.method
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

function initMethod() {}

function initComputed(vm: Component) {
  const computed = vm.$options.computed
  const watchers = Object.create(null)
  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    watchers[key] = new Watcher(vm, getter || noop, { lazy: true })
  }
}

function initWatch() {}

function getData(data: Function, vm: Component): any {
  data.call(vm, vm)
}
