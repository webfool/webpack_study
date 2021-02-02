// import a from './a'
// import './style'
import './reset'
import moment from 'moment'
// import bg from './earth.jpg'
// import commonSay from '@common/say'

// console.log('bg ->', bg)
// console.log('in index')
// a()

// const fn = () => {
//   console.log('index fn', [].includes(1))
// }

// function doc(target) {
//   console.log('target ->', target)
// }
// @doc
// class Me {
//   name = 'hw'
// }

// console.log('me ->', new Me())
// console.log('commonSay ->', commonSay)

// console.log('env ->', ENV)

// 测试代理
// fetch('/api/account/testFetch', {
//   method: 'get'
// }).then(res => res.json()).then(result => {
//   console.log('result ->', result)
// })

// 懒加载
// setTimeout(() => {
//   import('./b.js').then(({default: b}) => {
//     b()
//   })
// }, 3000)

// import('./page.js').then(({default: page}) => {
//   console.log('page', page)
// })

// import('./a.js').then(({default: a}) => {
//   console.log('a', a)
// })

// import('./b.js').then(({default: b}) => {
//   console.log('b', b)
// })

// import('./c.js').then(({default: c}) => {
//   console.log('c', c)
// })

console.log('index111')
console.log(moment)
// function test() {
//   import(
//     /* webpackPrefetch: true */
//     './a'
//   ).then(() => {
//     console.log('a')
//   })
// }