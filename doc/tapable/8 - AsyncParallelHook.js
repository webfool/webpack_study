// *** AsyncParallelHook 异步并行，不支持熔断，支持异常处理 ***
const { AsyncParallelHook } = require('tapable');
const hook = new AsyncParallelHook(['name']);

console.time('cost');

// === tapAsync 异步并行测试 ===
// 所有 cb 不带参数执行，才会执行最后的回调。cb 带参数执行，代表熔断或异常，直接执行最后的回调
hook.tapAsync('async-1', (name, cb) => {
  setTimeout(() => {
    console.log(`async-1: hello ${name}`);
    cb('123');
  }, 1000);
});

hook.tapAsync('async-2', (name, cb) => {
  setTimeout(() => {
    console.log(`async-2: hello ${name}`);
    cb();
  }, 2000);
});

hook.callAsync('from async', (res) => {
  console.log('done', res);
  console.timeEnd('cost');
});


// === tapPromise 异步并行测试 ===
// 所有 promise 都 resolve，才会走 then，不接收 resolve 的参数。有一个 promise 变 reject，则走 catch
// hook.tapPromise('promise-1', (name) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log(`promise-1: hello ${name}`);
//       reject('abc');
//     }, 1000);
//   });
// });

// hook.tapPromise('promise-2', (name) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log(`promise-2: hello ${name}`);
//       resolve();
//     }, 2000);
//   });
// });

// hook.promise('from promise')
// .then((res) => {
//   console.log('res ->', res)
// })
// .catch((err) => {
//   console.log('err ->', err)
// })