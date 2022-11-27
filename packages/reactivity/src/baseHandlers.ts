import { track, trigger } from './effect'
import { ReactiveFlags } from './reactive'
export const mutableHandlers = {
  /**
   * @param target 被代理的对象
   * @param key 获取的属性
   * @param receiver 代理对象
   */
  get(target, key, receiver) {
    // 如果存在get,说明target是代理对象，返回true
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    track(target, key)
    return Reflect.get(target, key, receiver) // 处理了this指向问题
  },
  /**
   * @param target 被代理的对象
   * @param key 设置的属性
   * @param value 设置值
   * @param receiver 代理对象
   * @returns
   */
  set(target, key, value, receiver) {
    const oldValue = target[key]
    let r = Reflect.set(target, key, value, receiver)
    // 新值与旧值不一致时才触发依赖收集
    if (oldValue !== value) {
      trigger(target, key, value, oldValue)
    }
    return r
  }
}
