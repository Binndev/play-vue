import { mergeOptions } from 'src/utils'
import { GlobalApi } from 'types/global-api'

export function initMixin(Vue: GlobalApi) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
