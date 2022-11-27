export let activeEffect

// 清空依赖
function clearUpEffect(effect) {
  let { deps } = effect
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect)
  }
  effect.deps.length = 0
}

class ReactiveEffect {
  public active = true // 副作用函数状态
  public deps = [] // 依赖
  public parent = undefined
  constructor(public fn) {}
  run() {
    // 如果是未激活状态，则调用fn
    if (!this.active) {
      return this.fn()
    }
    // 其它状态则说明是激活状态
    try {
      this.parent = activeEffect
      activeEffect = this
      // 再收集依赖之前应当先把之前的依赖清空
      clearUpEffect(this)
      return this.fn() // 这个地方调用回调函数时，读取target的属性，只要读取target的属性，就会触发依赖收集
    } finally {
      activeEffect = this.parent
      this.parent = undefined
    }
  }
}

/**
 * 副作用函数 // 依赖收集就是新疆当前的effect变成全局的，稍候取值的时候就可以拿到这个属性
 * @param fn
 */
export function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

const targetMap = new WeakMap()
// 依赖收集
export function track(target, key) {
  if (!activeEffect) {
    // 取值操作没有发生在effect中
    return
  }

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  let shouldTrack = !dep.has(activeEffect)
  if (shouldTrack) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep) // 后续需要通过effect来清的的时候可以去操作
    // 一个属性对应多个effect，一个effect对应多个属性
    // 属性和effect是多对多的关系
  }
}

// 触发更新
export function trigger(target, key, newValue, oldValue) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }

  const deps = depsMap.get(key)
  if (deps) {
    const effects = [...deps]
    effects.forEach((effect) => {
      if (effect !== activeEffect) {
        effect.run()
      }
    })
  }
}
