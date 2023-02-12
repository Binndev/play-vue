import { observe } from 'src/observe'
import { Component } from 'types/component'

export function initState(vm: Component) {
  const opts = vm.$options
  if (opts.props) {
    initProps()
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed()
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
  observe(data)
}

function initMethod() {}

function initComputed() {}

function initWatch() {}

function getData(data: Function, vm: Component): any {
  data.call(vm, vm)
}
