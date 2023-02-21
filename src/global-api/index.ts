import { GlobalApi } from 'types/global-api'
import { nextTick } from 'utils'
import { initMixin } from './mixin'

export function initGlobalApi(Vue: GlobalApi) {
  Vue.options = {}
  Vue.nextTick = nextTick
  initMixin(Vue)
}
