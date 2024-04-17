// console.log(__dirname)
// console.log(__filename)

const foo=()=>{
    console.log('hello foo')
    // console.log(__dirname)
    // console.log(__filename)
    // console.log(process.cwd())
}
console.log('hello from helper')

module.exports={www: foo}