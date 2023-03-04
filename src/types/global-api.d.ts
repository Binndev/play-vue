import { Component } from './component'

export interface GlobalApi {
  options: Record<string, any>

  mixin: (mixin: Object) => GlobalApi
  nextTick: (fn: (...args: any[]) => any, ctx?: object) => void | Promise<any>
  set: <T>(target: Object | Array<T>, key: string | number, value: T) => T
  extend: (options: typeof Component | object) => typeof Component
  delete: <T>(target: Object | Array<T>, key: string | number) => void
  component: (
    id: string,
    def?: typeof Component | Object
  ) => typeof Component | void
}
