// *** SyncLoopHook 顺序执行，如果某个回调返回非 undefined 则从头开始 ***

const {SyncLoopHook} = require('tapable')

const hook = new SyncLoopHook(['name', 'age'])

let count = 0

hook.tap('syncLoopHook1', function(name, age) {
  console.log(`syncLoopHook1: ${name} ${age}`)
})

hook.tap('syncLoopHook2', function(name, age) {
  console.log(`syncLoopHook2: ${name} ${age}`)
})

hook.tap('syncLoopHook3', function(name, age) {
  console.log(`syncLoopHook3: ${name} ${age}`)
  if (count === 3) return
  else return ++count
})

hook.call('hw', 10)