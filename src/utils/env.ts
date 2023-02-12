export function def(
  target: Object,
  key: string,
  val: any,
  enumberable?: boolean
) {
  Object.defineProperty(target, key, {
    configurable: true,
    writable: true,
    value: val,
    enumerable: !!enumberable,
  })
}
