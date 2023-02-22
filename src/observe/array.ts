import { def } from 'src/utils'

export const arrayProto = Object.create(Array.prototype)
export const arrayMethods = [
  'pop',
  'push',
  'shift',
  'unshift',
  'sort',
  'reverse',
  'splice',
]

arrayMethods.forEach(method => {
  const origin = arrayProto[method]
  def(arrayProto, method, function mutal(...args) {
    const result = origin.apply(this, args)

    // 对新增的内容进行劫持观测
    let inserted
    let ob = this.__ob__
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
      default:
        break
    }
    if (inserted) {
      ob.observeArray(inserted)
    }
    ob.dep.notify()
    return result
  })
})
