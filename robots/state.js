const fs = require('fs')
const contentFilePath = './content.json'

function save(content){
    const contentString = JSON.stringify(content) // transformar em string
    return fs.writeFileSync(contentFilePath, contentString)
}

function load(){
    const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8')
    const contentJson = JSON.parse(fileBuffer) // transformar em json
    return contentJson
}

module.exports = {
    save,
    load,
}