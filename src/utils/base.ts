export const LIFE_CYCLE = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
]
export const hasOwn = Object.hasOwn
export function noop(a?: any, b?: any, c?: any) {}
/**
 * str是否是_或者$开头
 */
export function isReversed(str: string): boolean {
  const c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5f
}

// 创建一个map，返回一个方法判断某个key是否存在该map中

export function makeMap(
  str: string,
  expectsLowerCase?: boolean
): (val: string) => boolean {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0, l = list.length; i < l; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val]
}
