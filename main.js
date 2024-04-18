const path= require('node:path')
const readline= require('node:readline/promises')
const fsPromises= require('node:fs/promises')
const os= require('node:os')
const EventEmitter= require('node:events')
const http= require('node:http')

async function foo(){
    try{
        console.log("--------------start")
        // ----- PATH:
        // console.log(path.basename(__filename));
        // console.log(path.dirname(__filename));
        // console.log(path.extname(__filename));
        // console.log(path.parse(__filename).name);
        // console.log(path.join(__dirname, 'do','some','one','else'));
        // console.log(path.normalize("\\\\\\\Liudmyla\\Desktop\\октен фулстак навчання\\nodeJS\n"));
        // console.log(path.isAbsolute("\\Users\\Liudmyla\\Desktop\\октен фулстак навчання\\nodeJS\n"));

        // ----- readline:
        // readline.createInterface({
        //     input: process.stdin,
        //     output: process.stdout
        // }).question('enter your name: ', (name)=>{
        //     console.log(`hello, ${name}!`)
        //     process.exit(0)
        // })

        // const qw=readline.createInterface({
        //     input: process.stdin,
        //     output: process.stdout
        // })
        // const name= await qw.question('enter your name: ')
        //     console.log(`hello, ${name}!`)
        // qw.close()

        //--------fsPromises:
        //await fsPromises.writeFile('test.txt', 'hello writeFile')
        //const pathToTestFile=path.join(__dirname,'www', 'test2.txt')
        //await fsPromises.writeFile(pathToTestFile, 'hello writeFile2')
        // const data= await fsPromises.readFile(pathToTestFile, 'utf-8')
        // console.log(data)
        // await fsPromises.appendFile(pathToTestFile, '\nhello add new text')
        // await fsPromises.rename(pathToTestFile, path.join(__dirname, 'test3.txt'))
        // await fsPromises.mkdir(path.join(__dirname, 'foo', 'bar'), {recursive: true})
        // await fsPromises.writeFile(path.join(__dirname, 'foo', 'bar', "qwe.txt"), 'hello create new')
        //await fsPromises.rmdir(path.join(__dirname,'foo', 'bar'), {recursive:true})
        //await fsPromises.unlink(path.join(__dirname, 'test.txt'))
        // await fsPromises.copyFile(path.join(__dirname, 'www', 'test3.txt'), path.join(__dirname,'copy-test2.txt'))
        // const a = await  fsPromises.stat(path.join(__dirname, 'copy-test2.txt'))
        // console.log(a.isFile())

        //-------os
        // console.log(os.arch())
        // console.log(os.cpus())
        // console.log(os.homedir())
        // console.log(os.hostname())
        // console.log(os.version())
        // console.log(os.machine())
        // console.log(os.platform())
        // console.log(os.uptime() /60/60/24)

        //------process:
        // console.log(process.argv)

        //------events:
        // const myEmitter= new EventEmitter()
        // myEmitter.on('www', (...args)=>{
        //     console.log('hello events:', args)
        // })
        // myEmitter.once('once', ()=>{
        //     console.log('only once event')
        // })
        //
        // myEmitter.emit('www', 55,44,"gga")
        // myEmitter.emit('www')
        // myEmitter.emit('www')
        // myEmitter.emit('once')
        // myEmitter.emit('once')
        // myEmitter.emit('once')


        //-----http, creating server
        // const server= http.createServer((req, res) => {
        //     res.end('okay')
        // })
        // server.listen(3000, '0.0.0.0', ()=>{
        //     console.log('server is running http://0.0.0.0:3000/')
        // })

        // console.log("--------------finish")
    }catch (e) {
        console.log(e)
    }
}

void foo()
