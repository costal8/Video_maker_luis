const readline = require('readline-sync') // ler dados de entrada do usuario
const robots = {
    //userInput:require('../robots/user-input.js'),
    text:require('./robots/text.js')
}

async function start() {
    const content= {
        maximumSentences: 7
    }
    content.searchTerm = askAndReturnSearchTeam()
    content.prefix = askAndReturnPrefix()

    //robots.userInput(content)
    await robots.text(content)

    function askAndReturnSearchTeam() {        
    
        return readline.question('Type a Wikipedia search term: ')

    }
    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefixIdex = readline.keyInSelect(prefixes,'Choose one opition: ')
        const selectedPrefixText = prefixes[selectedPrefixIdex]
          
        return selectedPrefixText
    }
    
    console.log(JSON.stringify(content, null, 4))
}

start()