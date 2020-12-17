import a from './a'
import './style'
import './reset'
import bg from './earth.jpg'
import commonSay from '@common/say'

console.log('bg ->', bg)
console.log('in index')
a()

const fn = () => {
  console.log('index fn', [].includes(1))
}

function doc(target) {
  console.log('target ->', target)
}
// @doc
// class Me {
//   name = 'hw'
// }

// console.log('me ->', new Me())
console.log('commonSay ->', commonSay)

console.log('env ->', process.env.NODE_ENV)