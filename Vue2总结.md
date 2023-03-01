# Vue2 总结

## 数据劫持

Vue 在初始化时，会遍历 data 中的所有属性，通过 Object.defineProperty 方法定义属性的 getter 和 setter。
并将属性代理到实例上。当属性被读取时会触发 getter 方法，属性被赋值时会触发 setter 方法，从而实现数据劫持。

## 模板编译

## 响应式

## nextTick

## computed 原理

> 1.计算属性默认不会立即执行 2.计算属性依赖计算属性 watcher
