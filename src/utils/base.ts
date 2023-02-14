export const hasOwn = Object.hasOwn
export function noop(a?: any, b?: any, c?: any) {}
/**
 * str是否是_或者$开头
 */
export function isReversed(str: string): boolean {
  const c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5f
}
