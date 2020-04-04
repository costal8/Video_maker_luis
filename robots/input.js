const readline = require('readline-sync')
const state = require('./state.js')

function robot() {
    const content= {
        maximumSentences: 7
    }
    content.searchTerm = askAndReturnSearchTeam()
    content.prefix = askAndReturnPrefix()
    state.save(content)
    
    function askAndReturnSearchTeam() { 
        return readline.question('Type a Wikipedia search term: ')
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefixIdex = readline.keyInSelect(prefixes,'Choose one opition: ')
        const selectedPrefixText = prefixes[selectedPrefixIdex]
          
        return selectedPrefixText
    }
}

module.exports = robot
