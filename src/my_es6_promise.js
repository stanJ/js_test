const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

const resolvePromise = (promise, x) => {
  if (promise === x) {
    return reject(promise, new TypeError('Chaining cycle'))
  }
  if (x instanceof MyPromise) {
    x.then((v) => {
      resolvePromise(promise, v)
    }, (e) => {
      reject(promise, e)
    })
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // 函数或对象
    let used = false
    try {
      const then = x.then
      if (typeof then === 'function') {
        then.call(x, (v) => {
          if (used) return
          used = true
          resolvePromise(promise, v)
        }, (r) => {
          if (used) return
          used = true
          reject(promise, r)
        })
      } else {
        resolve(promise, x)
      }
    } catch (e) {
      if (used) return
      used = true
      reject(promise, e)
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
    try {
      let x = callback(arg)
      resolvePromise(promise, x)
    } catch (e) {
      reject(promise, e)
    }
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

    /**
     * 如果resolve和reject定义如下，在then方法里把resolve、reject作为参数传递给其他
     * 函数时，运行测试会报错
     */

    // const resolve = (value) => {
    //   if (this.state === PENDING) {
    //     this.state = FULFILLED
    //     this.value = value
    //     this.onFulfilledCallbacks.forEach(fn => fn())
    //   }
    // }
    // const reject = (reason) => {
    //   if (this.state === PENDING) {
    //     this.state = REJECTED
    //     this.reason = reason
    //     this.onRejectedCallbacks.forEach(fn => fn())
    //   }
    // }
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

MyPromise.defer = MyPromise.deferred = function () {
  let dfd = {}
  dfd.promise = new MyPromise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = MyPromise