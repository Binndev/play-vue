import { ComponentOptions } from 'types/options'
import { LIFE_CYCLE } from './base'

// 定义策略
const strats = {} as Record<string, Function>
function mergeLifecycleHook(
  parentVal: Array<Function> | null,
  childVal: Function | Array<Function> | null
): Array<Function> | null {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      return Array.isArray(childVal) ? childVal : [childVal]
    }
  } else {
    return parentVal
  }
}

LIFE_CYCLE.forEach(hook => {
  strats[hook] = mergeLifecycleHook
})
export function mergeOptions(
  parent: Record<string, any>,
  child: Record<string, any>
): ComponentOptions {
  const options = {}
  for (const key in parent) {
    mergeField(key)
  }
  for (const key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }

  function mergeField(key: string) {
    const strat = strats[key]
    if (strat) {
      options[key] = strat(parent[key], child[key])
    } else {
      options[key] = child[key] || parent[key]
    }
  }

  return options as ComponentOptions
}
