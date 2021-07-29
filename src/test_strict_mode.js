exports.cc = 22;
console.log('module global', this);
// console.log('globalThis', globalThis)
var val = 10;
console.log('test window', val === window.val);
(function () {
  // 'use strict';
  globalThis.console.log('function this', this)
})();
module.exports = {
  this_module: this,
  global_this: globalThis,
  aa: 11
}