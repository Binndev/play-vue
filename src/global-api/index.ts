import { GlobalApi } from 'types/global-api'
import { nextTick } from 'utils'
import { initExtend } from './extend'
import { initMixin } from './mixin'

export function initGlobalApi(Vue: GlobalApi) {
  Vue.options = {}
  Vue.nextTick = nextTick
  initMixin(Vue)
  initExtend(Vue)
}
