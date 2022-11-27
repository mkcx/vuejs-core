import { isObject } from '@vue/shared'
import { mutableHandlers } from './baseHandlers'

// 枚举，类似于标记，用于判断传进来的是不是代理对象
export const enum ReactiveFlags {
  IS_REACTIVE = '_v_isReactive'
}

const reactiveMap = new WeakMap()
export function reactive(target) {
  if (!isObject) return target
  // 如果存在get,说明target是代理对象，返回target
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }
  const existProxy = reactiveMap.get(target)
  if (existProxy) return existProxy

  const proxy = new Proxy(target, mutableHandlers)
  reactiveMap.set(target, proxy)
  return proxy
}
