import { GlobalApi } from 'types/global-api'
import { nextTick } from 'utils'
import { initComponent } from './component'
import { initExtend } from './extend'
import { initMixin } from './mixin'

export function initGlobalApi(Vue: GlobalApi) {
  Vue.options = {
    _base: Vue,
  }
  Vue.nextTick = nextTick
  initMixin(Vue)
  initExtend(Vue)
  initComponent(Vue)
}
