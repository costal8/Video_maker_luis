const algorithmia = require('algorithmia') // ler dados de entrada do usuario
const sentenceBoundaryDetection = require('sbd')
const algorithmiaApiKey = require('../robots/credentials/algorithmia.json').apiKey


async function robot(content) {
    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    breackContentIntoSentences(content)
    
    async function fetchContentFromWikipedia(content) {
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey) // autenticação no algorithmia 
        const WikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2') //defini algoritimo
        const WikipediaResponse = await WikipediaAlgorithm.pipe(content.searchTerm) // executa
        const WikipediaContent = WikipediaResponse.get() // captura o valor
        content.sourceContentOriginal = WikipediaContent.content
    }

    function sanitizeContent(content) {
        const withoutBlankLinesAndMarckdown = removeBlankLinesAndMarckdown(content.sourceContentOriginal)
        const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarckdown)      
        content.sourceContentSanitized = withoutDatesInParentheses

        function removeBlankLinesAndMarckdown(text){
            const allLines = text.split('\n')

            const withoutBlankLinesAndMarckdown = allLines.filter((line) => {
                if (line.trim().length === 0 || line.trim().startsWith('=')) {
                    return false
                }
                return true
            })
            return withoutBlankLinesAndMarckdown.join(' ')
        }        
    }
    function removeDatesInParentheses(text) {
        return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/ /g,' ')        
    }
    function breackContentIntoSentences(content) {
        content.sentences= []
        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
        sentences.forEach((sentence) => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    }
}
module.exports = robot