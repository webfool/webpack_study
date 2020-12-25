// *** SyncBailHook 顺序执行，返回值则会熔断，中断后面的执行 ***

const {SyncBailHook} = require('tapable')

const hook = new SyncBailHook(['name', 'age'])

hook.tap('syncBailHook1', (name, age) => {
  console.log(`syncBailHook1: ${name} ${age}`)
})

hook.tap('syncBailHook2', (name, age) => {
  console.log(`syncBailHook2: ${name} ${age}`)
  return '2222'
})

hook.tap('syncBailHook3', (name, age) => {
  console.log(`syncBailHook3: ${name} ${age}`)
})

hook.call('hw', 20)