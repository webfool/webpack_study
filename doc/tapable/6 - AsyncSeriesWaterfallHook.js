// *** AsyncSeriesWaterfallHook 异步串行，支持传递参数，支持异常处理 ***
let { AsyncSeriesWaterfallHook } = require("tapable");
let queue = new AsyncSeriesWaterfallHook(["name", "age"]);
console.time("cost");

// === tapAsync 异步串行可传递参数测试 ===
// 每个函数调用 callback(null, 'arg') 修改第一个参数，其它参数修改不了
// 出现异常时，通过 callback 的第一个参数传出错误，会在最后回调的第一个参数被接收到
// 最后回调的第二个参数取的是参数列表中的第一个值
// queue.tapAsync("async-1", function (name, age, callback) {
//     console.log(`async-1: ${name} ${age}`);
//     setTimeout(function () {
//       callback(null, 'from async-1');
//     }, 1000);
// });

// queue.tapAsync("async-2", function (name, age, callback) {
//   console.log(`async-2: ${name} ${age}`);
//   setTimeout(function () {
//     callback('abc', 'from async-2');
//   }, 2000);
// });

// queue.tapAsync("async-3", function (name, age, callback) {
//   console.log(`async-3: ${name} ${age}`);
//   setTimeout(function () {
//     callback(null, 'a');
//   }, 3000);
// });

// queue.callAsync("from async", 10, (err, data) => {
//   console.log(err, data);
//   console.timeEnd("cost");
// });

// === tapPromise 异步串行可传递参数测试 ===
// 每个 promise resolve 的值都会更新参数列表的第一个
// 最后的 then 回调会取参数列表的第一个
// 有异常时 reject，最后会走回调的 catch
queue.tapPromise('promise-1', (name, age) => {
  console.log(`promise-1: ${name} ${age}`)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('from promise-1')
    }, 1000)
  })
})

queue.tapPromise('promise-2', (name, age) => {
  console.log(`promise-2: ${name} ${age}`)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('from promise-2')
      // reject('2222')
    }, 1000)
  })
})

queue.tapPromise('promise-3', (name, age) => {
  console.log(`promise-3: ${name} ${age}`)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('from promise-3')
    }, 1000)
  })
})

queue.promise('from promise', 10)
.then((res) => {
  console.log('res ->', res)
})
.catch((err) => {
  console.log('err ->', err)
})