import { initLifeCycle } from 'instance/lifecycle'
import { initMixin } from 'instance/init'
import { GlobalApi } from 'types/global-api'

function Vue(options) {
  // 初始化
  this._init(options)
}

// @ts-expect-error Vue has function type
initMixin(Vue)
// @ts-expect-error
initLifeCycle(Vue)

export default Vue as unknown as GlobalApi

// 核心流程
/**
 * 1.创建响应式数据
 * 2.模板转换成ast语法树
 * 3.将ast语法树转换为render函数
 * 4.后续每次更新只执行render函数
 */
