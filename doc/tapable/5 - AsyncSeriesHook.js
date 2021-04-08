// *** AsyncSeriesHook 支持异步串行，不支持熔断，支持异常处理 ***
let { AsyncSeriesHook } = require("tapable");

let queue = new AsyncSeriesHook(["name"]);
console.time("cost");

// === tapAsync 异步串行测试 ===
// 每一个函数都需要上一个函数执行 callback 才会执行。如果 callback 有参数，则执行最后的回调
queue.tapAsync("async-1", function (name, callback) {
  console.log(`async-1: ${name}`)
  setTimeout(function () {
    callback()
  }, 1000);
});
queue.tapAsync("async-2", function (name, callback) {
  console.log(`async-2: ${name}`)
  setTimeout(function () {
    callback('222');
  }, 2000);
});
queue.tapAsync("async-3", function (name, callback) {
  console.log(`async-3: ${name}`)
  setTimeout(function () {
    callback();
  }, 3000);
});
queue.callAsync("zhufeng", (err) => {
  console.log(err);
  console.timeEnd("cost");
});

// === tapPromise 异步串行测试 ===
// 上一个 promise resolve 之后才会执行下一个 promise，resolve 的参数无效。所有 resolve 之后走回调的 then
// reject 之后走回调的 catch
// queue.tapPromise('promise-1', function(name) {
//   return new Promise((resolve, reject) => {
//     console.log(`promise-1: ${name}`)
//     setTimeout(() => {
//       resolve()
//     }, 1000)
//   })
// })

// queue.tapPromise('promise-2', function(name) {
//   return new Promise((resolve, reject) => {
//     console.log(`promise-2: ${name}`)
//     setTimeout(() => {
//       resolve()
//       // reject('abc')
//     }, 2000)
//   })
// })

// queue.tapPromise('promise-3', function(name) {
//   return new Promise((resolve, reject) => {
//     console.log(`promise-3: ${name}`)
//     setTimeout(() => {
//       resolve()
//     }, 3000)
//   })
// })

// queue.promise('from promise')
// .then((res) => {
//   console.log('res ->', res)
// })
// .catch((err) => {
//   console.log('err ->', err)
// })