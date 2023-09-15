// 1.0 收集key的依赖函数
class Depend {
  constructor() {
    this.realativefns = new Set();
  }
  addDepend(fn) {
    this.realativefns.add(fn);
  }
  collectDepend() {
    if (activeReactiveFn) {
      this.addDepend(activeReactiveFn);
    }
  }
  notify() {
    this.realativefns.forEach((fn) => {
      fn();
    });
  }
}
// 2.0 获取depend依赖，使用Map管理对象和依赖的关系
/* 
weakMap{
  obj:{
    map:{key:depend}
  }
}
*/
const targetMap = new WeakMap();
function getDepend(target, key) {
  let map = targetMap.get(target);
  if (!map) {
    map = new Map();
    targetMap.set(target, map);
  }
  let depend = map.get(key);
  if (!depend) {
    depend = new Depend();
    map.set(key, depend);
  }
  return depend;
}

// 3.0 响应式函数，使用就会创建一个响应式对象
function reactive(object) {
  return new Proxy(object, {
    get(target, key, receiver) {
      const depend = getDepend(target, key);
      depend.collectDepend();
      // console.log("get", depend);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, newValue, receiver) {
      Reflect.set(target, key, newValue, receiver);
      const depend = getDepend(target, key);
      // console.log("set", depend);
      depend.notify();
    },
  });
}

// 4.0 监听函数，直接调用函数一次，以便在数据劫持的get函数里面收集依赖
let activeReactiveFn = null;
function watchFn(fn) {
  activeReactiveFn = fn;
  fn();
  activeReactiveFn = null;
}

// 5.0 收集所有使用响应式数据的函数
function colletWatchFns(...fns) {
  // console.log(fns);
  fns.forEach((fn) => {
    watchFn(fn);
  });
}

module.exports = { reactive, colletWatchFns };
