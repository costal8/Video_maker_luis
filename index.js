const readline = require('readline-sync') // ler dados de entrada do usuario

function start() {
    const content= {}
    content.searchTerm = askAndReturnSearchTeam()
    function askAndReturnSearchTeam() {        
    
        return readline.question('Type a Wikipedia search term: ')
        
    }
    console.log(content)
}

start()