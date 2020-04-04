const algorithmia = require('algorithmia') // ler dados de entrada do usuario
const sentenceBoundaryDetection = require('sbd')
const algorithmiaApiKey = require('../robots/credentials/algorithmia.json').apiKey

const watsonApiKey = require('../robots/credentials/watson-nlu.json').apikey
const naturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js')
const wtsonlogin = require('../robots/credentials/watson-nlu.json').username
const wtsonlogin2 = require('../robots/credentials/watson-nlu.json').password
const watsonUrl = require('../robots/credentials/watson-nlu.json').url


const nlu = new naturalLanguageUnderstandingV1({
    username: wtsonlogin,
    password: wtsonlogin2,
    iam_apikey: watsonApiKey,
    version: '2018-12-19',
    url: watsonUrl,
})  

const state = require('./state.js')

async function robot() {
    const content = state.load()

    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    breackContentIntoSentences(content)
    limitMaximumSentences(content)
    await fetchKeywordsOfAllSentences(content)
    
    state.save(content)

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
    function limitMaximumSentences(content) {
        content.sentences = content.sentences.slice(0, content.maximumSentences)
    }
    
    async function fetchKeywordsOfAllSentences(content){
        console.log('> [text-robot] Starting to fetch keywords from Watson')

        for (const sentence of content.sentences){
            console.log(`> [text-robot] Sentence: "${sentence.text}"`)
            sentence.keywords = await fetchwatsonAndReturnKeywords(sentence.text)
        }
    }
    
    async function fetchwatsonAndReturnKeywords(sentence){
        return new Promise((resolve, reject) => {
            nlu.analyze({
                text: sentence,
                features: {
                    keywords:{}
                }
            },(error, response) => {
                
                if(error){
                    reject(error)
                    return                
                }

                const keywords = response.keywords.map((keyword) => {
                    return keyword.text
                })
                resolve(keywords)                
            })
        })
    } 
}
module.exports = robot