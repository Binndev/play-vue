import { Component } from 'types/component'
import { GlobalApi } from 'types/global-api'

export function initExtend(Vue: GlobalApi) {
  Vue.extend = function (options) {
    const Super = this
    const Sub = function VueComponent(this: any, options: any) {
      options = options || {}
      this._init(options)
    } as unknown as typeof Component

    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.options = options

    return Sub
  }
}
