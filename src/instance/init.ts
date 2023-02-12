import { compileToFunction } from 'compiler/index'
import { query } from 'src/utils'
import { Component } from '../types/component'
import { initState } from './state'
export function initMixin(Vue: typeof Component) {
  Vue.prototype._init = function (options) {
    const vm: Component = this
    vm.$options = options
    // 初始化状态
    initState(vm)

    if (options.el) {
      vm.$mount(options.el)
    }
  }

  Vue.prototype.$mount = function (el?: Element | string) {
    el = el && query(el)
    const opt = this.$options
    if (!opt.render) {
      let template
      if (!opt.template && el) {
        // @ts-expect-error
        template = el.outerHTML
      } else if (el) {
        template = opt.template
      }

      if (template) {
        const render = compileToFunction(template)
        opt.render = render
      }
    }
  }
}
