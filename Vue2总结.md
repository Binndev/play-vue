# Vue2 总结

## 数据劫持

Vue 在初始化时，会遍历 data 中的所有属性，通过 Object.defineProperty 方法定义属性的 getter 和 setter。
并将属性代理到实例上。当属性被读取时会触发 getter 方法，属性被赋值时会触发 setter 方法，从而实现数据劫持。

## 模板编译

## 响应式

## nextTick

## computed 实现原理

Vue 在初始化时，会为每个计算属性创建一个计算属性 watcher，并将这些 watcher 挂载到实例上。通过传入 lazy 选项控制当前 wathcer 是计算属性 watcher，将计算属性的 getter 作为 watcher 的 getter，计算属性初始不会立即执行，属性被引用时才会执行。watcher 内部通过 dirty 判断需不需要执行 getter，不需要执行则直接返回原来的 value，从而达到缓存的效果。

> 1.计算属性默认不会立即执行 2.计算属性依赖计算属性 watcher 3.通过 dirty 判断 getter 函数需不需要执行

## watch 实现原理

## diff 算法
