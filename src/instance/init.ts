import { compileToFunction } from 'compiler/index'
import Watcher from 'observe/watcher'
import { mergeOptions, query } from 'src/utils'
import { Component } from '../types/component'
import { callHook, mountComponent } from './lifecycle'
import { initState } from './state'
export function initMixin(Vue: typeof Component) {
  Vue.prototype._init = function (options) {
    const vm: Component = this
    vm.$options = mergeOptions(this.constructor.options, options)
    callHook(vm, 'beforeCreate')
    // 初始化状态
    initState(vm)
    callHook(vm, 'created')

    if (options.el) {
      vm.$mount(options.el)
    }
  }

  Vue.prototype.$mount = function (el?: Element | string) {
    callHook(this, 'beforeMount')
    el = el && query(el)
    const opt = this.$options
    if (!opt.render) {
      let template
      if (!opt.template && el) {
        // @ts-expect-error
        template = el.outerHTML
      } else {
        template = opt.template
      }

      if (template) {
        const render = compileToFunction(template)
        opt.render = render
      }
    }
    // @ts-expect-error
    mountComponent(this, el)
  }

  Vue.prototype.$watch = function (
    expOrFn: string | (() => any),
    cb: Function,
    options?: Record<string, any>
  ) {
    options = options || {}
    options.user = true
    const watcher = new Watcher(this, expOrFn, cb, options)
    return () => watcher.teardown()
  }
}
