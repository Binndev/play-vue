export function isFunction(val: unknown): val is (...args: any[]) => any {
  return typeof val === 'function'
}

const _toString = Object.prototype.toString

export function isPlainObject(val: unknown): boolean {
  return _toString.call(val) === '[object Object]'
}

export function isString(val: unknown): val is string {
  return typeof val === 'string'
}

export function isBoolean(val: unknown): val is boolean {
  return typeof val === 'boolean'
}

export function isDef(val: any): boolean {
  return val !== void 0 && val !== null
}

export function isUndef(val: any): boolean {
  return val === void 0 || val === null
}
