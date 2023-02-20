import { GlobalApi } from 'types/global-api'
import { initMixin } from './mixin'

export function initGlobalApi(Vue: GlobalApi) {
  Vue.options = {}
  initMixin(Vue)
}
