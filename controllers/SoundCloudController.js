// SoundcloudController.js

const axios = require('axios')
const buildUrl = require('build-url')

const logger = require('../helpers/logger')

function search (query, limit) {
  const clientID = process.env.SOUNDCLOUD_ID
  if (!clientID) { console.log('Missing clientID for Soundcloud') }

  const baseUrl = 'https://api-v2.soundcloud.com'

  const url = buildUrl(baseUrl, {
    path: 'search',
    queryParams: {
      q: query,
      client_id: clientID,
      limit: limit,
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
        logger.log('error', `SoundCloud API error (response) ${err.response.status}`)
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.headers)
      } else if (err.request) {
        logger.log('error', `SoundCloud API error (request) ${err.request}`)
        console.log(err.request)
      } else {
        logger.log('error', `SoundCloud API error ${err.message}`)
        console.log('Error', err.message)
      }
      console.log(err.config)
    })
}

module.exports.search = search
