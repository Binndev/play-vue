import { Component } from 'types/component'
import { GlobalApi } from 'types/global-api'
import { isUndef } from 'utils'

export function initComponent(Vue: GlobalApi) {
  Vue.component = function (id: string, def?: Object | typeof Component) {
    if (def) {
      def = typeof def === 'function' ? def : Vue.extend(def)
      if (isUndef(Vue.options.components)) {
        Vue.options.components = {}
      }
      Vue.options.components[id] = def
      return def as typeof Component
    }
  }
}
