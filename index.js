const readline = require('readline-sync') // ler dados de entrada do usuario

function start() {
    const content= {}
    content.searchTerm = askAndReturnSearchTeam()
    content.prefix = askAndReturnPrefix()
    function askAndReturnSearchTeam() {        
    
        return readline.question('Type a Wikipedia search term: ')

    }
    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefixIdex = readline.keyInSelect(prefixes,'Choose one opition: ')
        const selectedPrefixText = prefixes[selectedPrefixIdex]
        
        return selectedPrefixText
    }
    console.log(content)
}

start()