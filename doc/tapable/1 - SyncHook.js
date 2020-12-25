// *** SyncHook 顺序执行 ***

const {SyncHook} = require('tapable')

const hook = new SyncHook(['name', 'age'])

hook.tap('syncHook1', (name, age) => {
  console.log(`syncHook1: ${name} ${age}`)
})

hook.tap('syncHook2', (name, age) => {
  console.log(`syncHook2: ${name} ${age}`)
})

hook.tap('syncHook3', (name, age) => {
  console.log(`syncHook3: ${name} ${age}`)
})

hook.call('hw', 20)