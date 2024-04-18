const fsPromises=require("node:fs/promises")
const path=require('node:path')

async function creatingFiles(){
    try {
        // await fsPromises.mkdir(path.join(__dirname, 'baseFolder'))

        // await fsPromises.mkdir(path.join(__dirname, 'baseFolder', 'one'))
        // await fsPromises.writeFile(path.join(__dirname, 'baseFolder', 'one', 'one.txt'), 'from 1')

        // await fsPromises.mkdir(path.join(__dirname, 'baseFolder', 'two'))
        // await fsPromises.writeFile(path.join(__dirname, 'baseFolder', 'two', 'two.txt'), 'from 2')
        // await fsPromises.mkdir(path.join(__dirname, 'baseFolder', 'three'))
        // await fsPromises.writeFile(path.join(__dirname, 'baseFolder', 'three', 'three.txt'), 'from 3')
        // await fsPromises.mkdir(path.join(__dirname, 'baseFolder', 'four'))
        // await fsPromises.writeFile(path.join(__dirname, 'baseFolder', 'four', 'four.txt'), 'from 4')
        // await fsPromises.mkdir(path.join(__dirname, 'baseFolder', 'five'))
        // await fsPromises.writeFile(path.join(__dirname, 'baseFolder', 'five', 'five.txt'), 'from 5')
        console.log('-----start')
        console.log(path.join(__dirname,'baseFolder', 'one'))
        const oneDir= await fsPromises.stat(path.join(__dirname,'baseFolder', 'one'))
        console.log(`is directory- ${oneDir.isDirectory()}`)
        console.log(path.join(__dirname, 'baseFolder', 'one', 'one.txt'))
        const oneFile= await fsPromises.stat(path.join(__dirname, 'baseFolder', 'one', 'one.txt'))
        console.log(`is file- ${oneFile.isFile()}`)

        console.log(path.join(__dirname, 'baseFolder','two'))
        const twoDir=await fsPromises.stat(path.join(__dirname,'baseFolder', 'two' ))
        console.log(`is directory- ${twoDir.isDirectory()}`)
        console.log(path.join(__dirname, 'baseFolder', 'two', 'two.txt'))
        const twoFile= await fsPromises.stat(path.join(__dirname, 'baseFolder', 'two', 'two.txt'))
        console.log(`is file- ${twoFile.isFile()}`)

        console.log(path.join(__dirname, 'baseFolder', 'three'))
        const threeDir= await fsPromises.stat(path.join(__dirname,'baseFolder', 'three'))
        console.log(`is directory- ${threeDir.isDirectory()}`)
        console.log(path.join(__dirname, 'baseFolder', 'three', 'three.txt'))
        const threeFile= await fsPromises.stat(path.join(__dirname, 'baseFolder', 'three', 'three.txt'))
        console.log(`is file- ${threeFile.isFile()}`)

        console.log(path.join(__dirname, 'baseFolder', 'four'))
        const fourDir= await fsPromises.stat(path.join(__dirname,'baseFolder', 'four'))
        console.log(`is directory- ${fourDir.isDirectory()}`)
        console.log(path.join(__dirname, 'baseFolder', 'four', 'four.txt'))
        const fourFile= await fsPromises.stat(path.join(__dirname, 'baseFolder', 'four', 'four.txt'))
        console.log(`is file- ${fourFile.isFile()}`)

        console.log(path.join(__dirname, 'baseFolder', 'five'))
        const fiveDir= await fsPromises.stat(path.join(__dirname,'baseFolder', 'five'))
        console.log(`is directory- ${fiveDir.isDirectory()}`)
        console.log(path.join(__dirname, 'baseFolder', 'five', 'five.txt'))
        const fiveFile= await fsPromises.stat(path.join(__dirname, 'baseFolder', 'five', 'five.txt'))
        console.log(`is file- ${fiveFile.isFile()}`)


    }catch (e) {
        console.log(e)
    }
}

void creatingFiles()