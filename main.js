const fsPromises=require("node:fs/promises")
const path=require('node:path')

// v1:
// async function creatingFiles(){
//     try {
//         const basePath= path.join(process.cwd(), 'baseFolder')
//         await fsPromises.mkdir(basePath, { recursive: true})
//
//         await fsPromises.mkdir(path.join(basePath, 'one'), { recursive: true})
//         await fsPromises.writeFile(path.join(process.cwd(), 'baseFolder', 'one', 'one.txt'), 'from 1')
//
//         await fsPromises.mkdir(path.join(basePath, 'two'),{ recursive: true})
//         await fsPromises.writeFile(path.join(basePath, 'two', 'two.txt'), 'from 2')
//         await fsPromises.mkdir(path.join(basePath, 'three'),{ recursive: true})
//         await fsPromises.writeFile(path.join(basePath, 'three', 'three.txt'), 'from 3')
//         await fsPromises.mkdir(path.join(basePath, 'four'),{ recursive: true})
//         await fsPromises.writeFile(path.join(basePath, 'four', 'four.txt'), 'from 4')
//         await fsPromises.mkdir(path.join(basePath, 'five'),{ recursive: true})
//         await fsPromises.writeFile(path.join(basePath, 'five', 'five.txt'), 'from 5')
//         console.log('-----start')
//         console.log(path.join(basePath, 'one'))
//         const oneDir= await fsPromises.stat(path.join(basePath, 'one'))
//         console.log(`is directory- ${oneDir.isDirectory()}`)
//         console.log(path.join(basePath, 'one', 'one.txt'))
//         const oneFile= await fsPromises.stat(path.join(basePath, 'one', 'one.txt'))
//         console.log(`is file- ${oneFile.isFile()}`)
//
//         console.log(path.join(basePath,'two'))
//         const twoDir=await fsPromises.stat(path.join(basePath, 'two' ))
//         console.log(`is directory- ${twoDir.isDirectory()}`)
//         console.log(path.join(basePath, 'two', 'two.txt'))
//         const twoFile= await fsPromises.stat(path.join(basePath, 'two', 'two.txt'))
//         console.log(`is file- ${twoFile.isFile()}`)
//
//         console.log(path.join(basePath, 'three'))
//         const threeDir= await fsPromises.stat(path.join(basePath, 'three'))
//         console.log(`is directory- ${threeDir.isDirectory()}`)
//         console.log(path.join(basePath, 'three', 'three.txt'))
//         const threeFile= await fsPromises.stat(path.join(basePath, 'three', 'three.txt'))
//         console.log(`is file- ${threeFile.isFile()}`)
//
//         console.log(path.join(basePath, 'four'))
//         const fourDir= await fsPromises.stat(path.join(basePath, 'four'))
//         console.log(`is directory- ${fourDir.isDirectory()}`)
//         console.log(path.join(basePath, 'four', 'four.txt'))
//         const fourFile= await fsPromises.stat(path.join(basePath, 'four', 'four.txt'))
//         console.log(`is file- ${fourFile.isFile()}`)
//
//         console.log(path.join(basePath, 'five'))
//         const fiveDir= await fsPromises.stat(path.join(basePath, 'five'))
//         console.log(`is directory- ${fiveDir.isDirectory()}`)
//         console.log(path.join(basePath, 'five', 'five.txt'))
//         const fiveFile= await fsPromises.stat(path.join(basePath, 'five', 'five.txt'))
//         console.log(`is file- ${fiveFile.isFile()}`)
//
//
//     }catch (e) {
//         console.log(e)
//     }
// }
//
// void creatingFiles()

// or v2:
async function creatingFiles(){
    try {
        const basePath= path.join(process.cwd(), 'baseFolder2')
        await fsPromises.mkdir(basePath, { recursive: true})

        const folders= ['folder1','folder2','folder3','folder4','folder5']
        const files= ['file1','file2','file3','file4','file5']

        for (const folder of folders) {
            const folderPath= path.join(basePath, folder)

            await fsPromises.mkdir(folderPath, {recursive: true})

            for (const file of files) {
                const filePath= path.join(folderPath, `${file}.txt`)

                await fsPromises.writeFile(filePath, "hey file")
            }
        }

        const fileName= await fsPromises.readdir(basePath)
        console.log(fileName)
        for (const item of fileName) {
            const stat= await fsPromises.stat(path.join(basePath, item))
            console.log(`${item} is directory: ${stat.isDirectory()}`)
        }

    }catch (e) {
        console.log(e)
    }
}

void creatingFiles()
