// var count = require('./count')
// console.log(count.val)
// console.log(count.addOne())
// console.log(count.val)
// var test = require('./test_strict_mode')
// console.log(new Date().valueOf(), 'before import');
// import test, { addHeight, height, obj } from './test_es_module';
// console.log('test', test);
// document.getElementById('add').addEventListener('click', function(e){
//   addHeight();
//   console.log('new height', height);
//   console.log('import height', test.height, 'import height1', test.height1);
//   height = 0;
//   obj.prop = 123;
//   console.log('obj', obj);
//   obj = {};
//   console.log('new obj', obj);
// });

// const aFunction = async () => {
//   console.log('hh');
// };
// const p = aFunction();
// p.then(() => {
//   console.log('promise~', p);
// });
// console.log('promise', p);

// const p = aFunction();
// const p1 = p.then(() => undefined);
// const p2 = p1.then(() => {
//   console.log('promise1~', p1);
//   return new Promise((resolve, reject) => {
//     console.log('time', new Date().valueOf());
//     setTimeout(() => {
//       resolve('hello');
//     }, 2000);
//   });
// });
// const p3 = p2.then(() => {
//   console.log('promise2~', p2);
//   console.log('time~', new Date().valueOf());
//   console.log('promise3', p3);
// })
// console.log('promise', p);
// console.log('promise1', p1);
// console.log('promise2', p2);

const sleep = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Date().valueOf());
    }, ms);
  });
};
// const aFunction = async () => {
//   console.log('time', new Date().valueOf());
//   await sleep(2000);
//   console.log('time~', new Date().valueOf());
// };
// aFunction();
// console.log('time_', new Date().valueOf());

// const aFunction = async () => {
//   let p1 = sleep(1000);
//   let p2 = sleep(2000);
//   console.log('start_time~', new Date().valueOf());
//   console.log(await p1);
//   console.log(await p2);
//   console.log('end_time~', new Date().valueOf());
// };
// aFunction();

// const aFunction = async () => {
//   let p1 = sleep(1000);
//   let p2 = sleep(2000);
//   let p3 = sleep(3000);
//   let promises = [p1, p2, p3];
//   let results = [];
//   console.log('start_time~', new Date().valueOf());
//   for (let promise of promises) {
//     console.log('for', new Date().valueOf());
//     results.push(await promise);
//   }
//   console.log(results);
//   console.log('end_time~', new Date().valueOf());
// };
// aFunction();
