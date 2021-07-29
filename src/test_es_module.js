console.log('es module global', this);
(function () {
  // 'use strict';
  console.log('function this', this);
})();
export let height = 167;
export let obj = {};
var height1 = 10;
console.log('test window', height === window.height)
console.log(new Date().valueOf(), 'initial', height, height1);
export const name = 'stan';
setTimeout(function () {
  height += 10;
  console.log(new Date().valueOf(), 'timeout height', height);
}, 1000);
// setInterval(function () {
//   height1 += 3;
//   console.log(new Date().valueOf(), 'interval height1', height1);
// }, 1000);
export const addHeight = function () {
  height += 2;
  console.log(new Date().valueOf(), 'add height', height);
};
console.log('es module global', this);
export default {
  age: 28,
  height: height,
  height1: height1
}
console.log('es module global', this);