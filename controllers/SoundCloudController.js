// SoundcloudController.js

const axios = require('axios')
const buildUrl = require('build-url')

function search (query) {
  const clientID = process.env.SOUNDCLOUD_ID
  if (!clientID) { console.log('Missing clientID for Soundcloud') }

  const baseUrl = 'https://api-v2.soundcloud.com'

  const url = buildUrl(baseUrl, {
    path: 'search',
    queryParams: {
      q: query,
      client_id: clientID,
      limit: 5,
      offset: 0,
      app_locale: 'en'
    }
  })

  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  return axios.get(url, config)
    .catch(function (err) {
      if (err.response) {
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.headers)
      } else if (err.request) {
        console.log(err.request)
      } else {
        console.log('Error', err.message)
      }
      console.log(err.config)
    })
}

module.exports.search = search
