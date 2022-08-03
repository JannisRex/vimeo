var config = require('./config.json')
let Vimeo = require('vimeo').Vimeo

const user = '/users/109239427'
const pathDE = user + '/folders/3299245/videos?fields=uri' // Videos DE
const pathEN = user + '/folders/3410229/videos?fields=uri' // Videos EN
const path = user + '/videos?fields=uri'

// Setting Auth + Token from config
const client = new Vimeo(
  config.client_id,
  config.client_secret,
  config.access_token
)

const basicQuery = {
  // GET REQUEST for all Videos with an unrated content_rating param
  method: 'GET',
  path,
  query: {
    page: 1,
    per_page: 100,
    direction: 'asc',
    filter: 'content_rating',
    filter_content_rating: 'unrated',
  },
}

// Queries Video ID's and writes them to result.txt
searchVideos = () => {
  const totalResponses = 1627 // body.total in every response
  // !!! This is hardcoded, need to do GET request async so I can fetch body.total before calling again !!! \\
  // TODO: create promise helper for client.request or use callback
  const pages = Math.floor(totalResponses / 100) + 1

  for (let page = 1; page <= pages; page++) {
    let query = createQuery(page)
    searchByQuery(client, query, page)
  }
}

// Only adjusts page number for query
// So we can get ALL pages at once and save to file(s)
createQuery = (page) => {
  let query = basicQuery
  query.query.page = page
  return query
}

// searches by given query
searchByQuery = (client, query, page) => {
  // Make an API request
  client.request(query, async (error, body, statusCode, headers) => {
    if (error) {
      console.log('error')
      console.log(error)
    } else {
      const searchResponse = body.data
      const filteredResponse = filterID(searchResponse) // Filter for ID's only
      const formattedResponse = String(filteredResponse).replaceAll(',', ' ') // Replace Comma with Whitespace
      writeToFile(formattedResponse, './results/result' + page + '.txt') // Writes content to File with given name
      // writeToFile(String(body.total), './results/total.txt') // Writes count of responses to file
    }

    console.log('status code: ', statusCode) // 200 or 400/404
    console.log('headers: ', headers) // x-rate-limit and other info
  })
}

// returns array with video ids for given search
filterID = (arr) => {
  // This gets the video ID from the uri
  const regEx = /([^\/]+$)/
  let content = []

  arr.filter((video) => {
    let res = video.uri.match(regEx)
    content.push(res[0])
  })

  return content
}

writeToFile = (content, fileName) => {
  const fs = require('fs')
  fs.writeFile(__dirname + '/' + fileName, content, (err) => {
    if (err) {
      console.error(err)
    }
  })
}

// Start the Search
if (true) {
  searchVideos()
}
