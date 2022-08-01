var config = require('./config.json')
let Vimeo = require('vimeo').Vimeo
let client = new Vimeo(
  config.client_id,
  config.client_secret,
  config.access_token
)

client.request(
  {
    method: 'GET',
    path: '/tutorial',
  },
  function (error, body, status_code, headers) {
    if (error) {
      console.log(error)
    }

    console.log(body)
  }
)
