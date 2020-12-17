import a from './a'
import './style.css'
import './style.less'
import bg from './earth.jpg'

console.log('bg ->', bg)
console.log('in index')
a()

const fn = () => {
  console.log('index fn', [].includes(1))
}

function doc(target) {
  console.log('target ->', target)
}
@doc
class Me {
  name = 'hw'
}

console.log('me ->', new Me())