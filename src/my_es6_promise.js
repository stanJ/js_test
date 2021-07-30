const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
const PROMISE_ID = Math.random().toString(36).substring(2)

function isObjectOrFunction(x) {
  let type = typeof x
  return x !== null && (type === 'object' || type === 'function')
}

function isFunction(x) {
  return typeof x === 'function'
}

let id = 0
function nextId() {
  return id++
}

const resolvePromise = (promise, x) => {
  if (promise === x) {
    return reject(promise, new TypeError('Chaining cycle'))
  }
  if (x && x.constructor === promise.constructor) {
    // 两种写法 x instanceof MyPromise 和 x.constructor === promise.constructor；需要注意的是：
    // 后一种必须判断x是否存在 否则会报constructor of undefined的错误
    x.then((v) => {
      resolvePromise(promise, v)
    }, (e) => {
      reject(promise, e)
    })
  } else if (isObjectOrFunction(x)) {
    // 函数或对象
    let used = false
    let then = void 0
    try {
      then = x.then
    } catch (e) {
      return reject(promise, e)
    }
    if (isFunction(then)) {
      try {
        then.call(x, (v) => {
          if (used) return
          used = true
          resolvePromise(promise, v)
        }, (r) => {
          if (used) return
          used = true
          reject(promise, r)
        })
      } catch (e) {
        if (used) return
        used = true
        reject(promise, e)
      }
    } else {
      resolve(promise, x)
    }
  } else {
    // 普通值
    resolve(promise, x)
  }
}

function noop() {}

function flushSchedule(func) {
  setTimeout(func, 0)
}

function settlePromise(promise, callback, arg) {
  return () => {
    let x = void 0
    try {
      x = callback(arg)
    } catch (e) {
      return reject(promise, e)
    }
    resolvePromise(promise, x)
  }
}

function resolve (promise, value) {
  if (promise.state === PENDING) {
    promise.state = FULFILLED
    promise.value = value
    promise.onFulfilledCallbacks.forEach(fn => fn())
  }
}

function reject (promise, reason) {
  if (promise.state === PENDING) {
    promise.state = REJECTED
    promise.reason = reason
    promise.onRejectedCallbacks.forEach(fn => fn())
  }
}

class MyPromise {
  state = PENDING
  value = undefined
  reason = undefined
  onFulfilledCallbacks = []
  onRejectedCallbacks = []
  constructor(executor) {
    this[PROMISE_ID] = nextId()
    try {
      executor((value) => {
        resolve(this, value);
      }, (reason) => {
        reject(this, reason)
      })
    } catch (e) {
      reject(this, e)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
    let child = new this.constructor(noop)

    if (this.state === FULFILLED) {
      flushSchedule(settlePromise(child, onFulfilled, this.value))
    } else if (this.state === REJECTED) {
      flushSchedule(settlePromise(child, onRejected, this.reason))
    } else if (this.state === PENDING) {
      this.onFulfilledCallbacks.push(() => {
        flushSchedule(settlePromise(child, onFulfilled, this.value))
      })
      this.onRejectedCallbacks.push(() => {
        flushSchedule(settlePromise(child, onRejected, this.reason))
      })
    }

    return child
  }
}

// promises-aplus-tests测试MyPromise的测试代码
MyPromise.defer = MyPromise.deferred = function () {
  let dfd = {}
  dfd.promise = new MyPromise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = MyPromise