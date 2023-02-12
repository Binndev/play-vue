import { initMixin } from "./instance/init";

function Vue(options) {
  // 初始化
  this._init(options);
}

// @ts-expect-error Vue has function type
initMixin(Vue);

export default Vue;