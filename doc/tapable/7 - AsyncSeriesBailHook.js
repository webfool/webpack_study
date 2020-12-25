// *** AsyncSeriesBailHook 异步串行，支持熔断，支持异常处理 ***
let { AsyncSeriesBailHook } = require("tapable");
let queue = new AsyncSeriesBailHook(["name"]);

console.time("cost");

// === tapAsync 异步串行可熔断测试 ===
// 每一个异步函数都需要等待上一个 callback 之后才能执行
// 支持 callback 传参，代表熔断或报错
// queue.tapAsync("async-1", function (name, callback) {
//   console.log(`async-1: ${name}`);
//   setTimeout(function () {
//     callback();
//   }, 1000);
// });

// queue.tapAsync("async-2", function (name, callback) {
//   console.log(`async-2: ${name}`);
//   setTimeout(function () {
//     callback('222');
//   }, 2000);
// });

// queue.tapAsync("async-3", function (name, callback) {
//   console.log(`async-3: ${name}`);
//   setTimeout(function () {
//     callback();
//   }, 3000);
// });

// queue.callAsync("from async", (err) => {
//   console.log(err);
//   console.timeEnd("cost");
// });


// === tapPromise 异步串行可熔断测试 ===
// 每一个 promise 都需要等待上一个 promise resolve 之后才能执行
// resolve 传参代表熔断，reject 代表报错
queue.tapPromise('promise-1', function(name) {
  console.log(`promise-1: ${name}`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
})

queue.tapPromise('promise-2', function(name) {
  console.log(`promise-2: ${name}`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // resolve()
      resolve() // 熔断
      // reject() // 报错
    }, 2000)
  })
})

queue.tapPromise('promise-3', function(name) {
  console.log(`promise-3: ${name}`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 3000)
  })
})

queue.promise('from promise')
.then((res) => {
  console.log('res ->', res)
})
.catch((err) => {
  console.log('err ->', err)
})