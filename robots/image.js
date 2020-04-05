const goolge = require('googleapis').google
const customSearch = goolge.customsearch('v1')
const state = require('./state.js')

const googleSearchCredentials = require('./credentials/google-search.json')

async function robot() {
    const content = state.load()

    await fetchImagesOfAllSentences(content)

    state.save(content)

    async function fetchImagesOfAllSentences(content){
        for (const senetnce of content.centences){
            const query = `${content.searchTerm} ${senetnce.keywords[0]}`
            senetnce.images = await fetchGoogleAndReturnImagesLinks(query)
            senetnce.googleSearchQyery = query
        }
    }                  
         

    async function fetchGoogleAndReturnImagesLinks(query){        
        const response = await customSearch.cse.list({
            auth: googleSearchCredentials.apiKey,
            cxa: googleSearchCredentials.searchEngineId,
            q: query,
            searchType: 'image',
            num: 2
        })

        const imageUrl = response.date.items.map((item) => {
            return item.link
        })
        return imageUrl
    }       
}
module.exports = robot