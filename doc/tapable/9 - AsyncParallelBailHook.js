// *** AsyncParallelBailHook 异步并行，支持熔断，支持异常处理 ***

let { AsyncParallelBailHook } = require("tapable");
let queue = new AsyncParallelBailHook(["name"]);
console.time("cost");

// === 测试 tapAsync ===
// 所有 cb 不带参数执行，才会执行最后的回调。有一个 cb 带参数执行，代表异常处理，直接执行最后的回调
// queue.tapAsync('async-1', function(name, callback) {
//   setTimeout(() => {
//     console.log('async-1: ', name)
//     callback()
//   }, 1000)
// })

// queue.tapAsync('async-2', function(name, callback) {
//   setTimeout(() => {
//     console.log('async-2: ', name)
//     callback('222')
//   }, 2000)
// })

// queue.tapAsync('async-3', function(name, callback) {
//   setTimeout(() => {
//     console.log('async-3: ', name)
//     callback()
//   }, 3000)
// })

// queue.callAsync('from async', (result) => {
//   console.log('cb ->', result)
//   console.timeEnd("cost");
// })

// === 测试 tapPromise ===
// 当所有 promise 都 resolve 时，会执行回调 then。同时支持某个 promise 直接 resolve 值，即刻执行回调 then
// 当某个 promise reject 时，会执行回调 catch
queue.tapPromise("promise-1", function (name) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log('promise-1', name);
      resolve()
    }, 1000);
  });
});
queue.tapPromise("promise-2", function (name) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log('promise-2', name);
      // resolve('2222');
      reject('2222')
    }, 2000);
  });
});

queue.tapPromise("promise-3", function (name) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log('promise-3', name);
      resolve();
    }, 3000);
  });
});

queue.promise("from promise").then(
  (result) => {
    console.log("成功", result);
    console.timeEnd("cost");
  },
  (err) => {
    console.error("失败", err);
    console.timeEnd("cost");
  }
);