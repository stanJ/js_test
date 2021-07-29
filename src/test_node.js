'use strict';
// console.log('node this', this);
// const x = 1;
// console.log('test window', x === globalThis.x)
// console.log('global this', Object.getOwnPropertyNames(globalThis));
// (function () {
//   // 'use strict';
//   console.log('function this', this);
// })();

// function getType() {
//   console.log(typeof this !== 'object' ? typeof this : Object.prototype.toString.call(this));
// }
// getType.call(7);
// getType.call('foo');
// getType.call(true);
// getType.call(undefined);
// getType.call(null);
// getType.call({ name: 'stan' });

// var o = {
//   f: function () {
//     return this.a + this.b
//   }
// };
// var p = {
//   a: 1,
//   b: 1,
//   obj: {
//     a: 2,
//     b: 2,
//     func: o.f
//   }
// };
// // console.log(p.obj.func());
// var ff = p.obj.func;
// console.log(ff());

// function Func () {

// };
// Func.prototype.val = 11;
// Func.prototype.test = function () {
//   console.log(this, this.constructor);
// };
// Func.prototype.test();

// var o = {
//   a: 1,
//   b: 2,
//   c: 3,
//   get average() {
//     return (this.a + this.b + this.c) / 3;
//   },
//   set average(val) {
//     this.a = this.b = this.c = val;
//   }
// };
// console.log(o.average);
// o.average = 4;
// console.log(o.a);
// console.log(o.b);
// console.log(o.c);
// console.log(Object.getOwnPropertyDescriptor(o, 'average'));
// Object.defineProperty(o, 'sum', {
//   get: function () {
//     return this.a + this.b + this.c;
//   },
//   set: function (val) {
//     this.a = this.b = this.c = val / 3;
//   },
//   enumerable: true,
//   configurable: true
// });
// console.log(o.sum);
// o.sum = 15;
// console.log(o.a);
// console.log(o.b);
// console.log(o.c);

// 如果g
function Person(name) {
  this.name = name;
  return {
    aa: 11
  };
}
var p = new Person('stan');
console.log(p);