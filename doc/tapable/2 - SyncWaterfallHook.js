// *** SyncWaterfallHook: 顺序执行，每个回调的返回值会更新参数列表的第一个值 ***

const {SyncWaterfallHook} = require('tapable')

const hook = new SyncWaterfallHook(['name', 'age'])

hook.tap('syncWaterfallHook1', (name, age) => {
  console.log(`syncWaterfallHook1: ${name} ${age}`)
  return 'syncWaterfallHook1'
})

hook.tap('syncWaterfallHook2', (name, age) => {
  console.log(`syncWaterfallHook2: ${name} ${age}`)
  return 'syncWaterfallHook2'
})

hook.tap('syncWaterfallHook3', (name, age) => {
  console.log(`syncWaterfallHook3: ${name} ${age}`)
  return 'syncWaterfallHook3'
})

hook.call('hw', 20)