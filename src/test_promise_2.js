const STATE = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected'
}

const generatePromise = (promise2, x, fulfill, reject) => {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }
  //If x is promise, call its then method to continue traversal
  if (x instanceof MyPromise) {
    x.then((value) => {
      generatePromise(promise2, value, fulfill, reject)
    }, (e) => {
      reject(e)
    })
  } else if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    //Prevent repeated calls, success and failure can only be called once
    let called;
    //If x is an object or function
    try {
      const then = x.then
      if (typeof then === 'function') {
        then.call(x, (y) => {
          if (called) return;
          called = true;
          //Note y is promise, continue to traverse
          generatePromise(promise2, y, fulfill, reject)
        }, (r) => {
          if (called) return;
          called = true;
          reject(r)
        })
      } else {
        fulfill(x)
      }
    } catch(e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    fulfill(x)
  }
}

class MyPromise {
  constructor(fn) {
    //Initialization
    this.state = STATE.PENDING
    this.value = null
    this.reason = null
    //Save array
    this.fulfilledCallbacks = []
    this.rejectedCallbacks = []
    //Success
    const fulfill = (value) => {
      //The status can only be changed when state is pending
      if (this.state === STATE.PENDING) {
        this.state = STATE.FULFILLED
        this.value = value
        this.fulfilledCallbacks.forEach(cb => cb())
      }
    }

    //Failure
    const reject = (reason) => {
      if (this.state === STATE.PENDING) {
        this.state = STATE.REJECTED
        this.reason = reason
        this.rejectedCallbacks.forEach(cb => cb())
      }
    }
    //Call reject on function execution error
    try {
      fn(fulfill, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    //Handling onfulfilled and onrejected
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e }
    const promise2 = new MyPromise((fulfill, reject) => {
      //SetTimeout macro task to ensure that onfulfilled and onrejected are executed asynchronously
      if (this.state === STATE.FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            generatePromise(promise2, x, fulfill, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.state === STATE.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            generatePromise(promise2, x, fulfill, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      //When then is pending, write these two states to the array
      if (this.state === STATE.PENDING) {
        this.fulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              generatePromise(promise2, x, fulfill, reject)
            } catch(e) {
              reject(e)
            }
          }, 0)
        })
        this.rejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              generatePromise(promise2, x, fulfill, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    return promise2
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