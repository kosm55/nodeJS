// console.log(process.cwd())
console.log('----------------')

const {www}=require('./www/helper')

www()

const {sum}=require('./www/qqq/down')
console.log(sum(10,20))

// console.log(__dirname)
// console.log(__filename)