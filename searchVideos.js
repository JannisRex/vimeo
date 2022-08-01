var config = require('./config.json')
var util = require('util')
const { request } = require('http')
let Vimeo = require('vimeo').Vimeo

// Queries Video ID's and writes them to result.txt
searchVideos = () => {
  // Setting Auth + Token from config
  const client = new Vimeo(
    config.client_id,
    config.client_secret,
    config.access_token
  )

  const user = '/users/109239427'
  const pathDE = user + '/folders/3299245/videos?fields=uri' // Videos DE
  const pathEN = user + '/folders/3410229/videos?fields=uri' // Videos EN
  const path = user + '/videos?fields=uri'

  const query = {
    // GET REQUEST for all Videos with an unrated content_rating param
    method: 'GET',
    path,
    query: {
      page: 1,
      per_page: 5,
      direction: 'asc',
      filter: 'content_rating',
      filter_content_rating: 'unrated',
    },
  }

  searchByQuery(client, query)
}

// searches by given query
searchByQuery = (client, query) => {
  // Make an API request
  client.request(query, async (error, body, statusCode, headers) => {
    if (error) {
      console.log('error')
      console.log(error)
    } else {
      const searchResponse = body.data
      const filteredResponse = filterID(searchResponse) // Filter for ID's only
      const formattedResponse = String(filteredResponse).replaceAll(',', ' ') // Replace Comma with Whitespace
      writeToFile(formattedResponse, '/result.txt') // Writes content to File with given name
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
