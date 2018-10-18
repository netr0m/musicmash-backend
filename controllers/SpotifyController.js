// SpotifyController.js
const axios = require('axios')
const querystring = require('querystring')
const buildUrl = require('build-url')

const logger = require('../helpers/logger')

/*
Function to get an access token for authentication
*/
function getAccessToken () {
  // Get credentials for Auth
  const clientID = process.env.SPOTIFY_ID
  if (!clientID) { console.log('Missing clientID for Spotify') }
  const clientSecret = process.env.SPOTIFY_SECRET
  if (!clientSecret) { console.log('Missing clientSecret for Spotify') }

  const url = 'https://accounts.spotify.com/api/token'

  const config = {
    headers: {
      'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  // Stringify using querystring (form)
  const body = querystring.stringify({
    grant_type: 'client_credentials'
  })

  return axios.post(url, body, config)
    .catch(function (err) {
      if (err.response) {
        logger.log('error', `Spotify Auth API error (response) ${err.response.status}`)
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.headers)
      } else if (err.request) {
        logger.log('error', `Spotify Auth API error (request) ${err.request}`)
        console.log(err.request)
      } else {
        logger.log('error', `Spotify Auth API error ${err.message}`)
        console.log('Error', err.message)
      }
      console.log(err.config)
    })
}

/*
Function to get the tracks
*/
function getTracks (query, limit, accessToken) {
  const baseUrl = 'https://api.spotify.com/v1'

  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  }

  // Build the full URL
  const url = buildUrl(baseUrl, {
    path: 'search',
    queryParams: {
      q: query,
      type: 'track',
      limit: limit
    }
  })

  return axios.get(url, config)
    .catch(function (err) {
      if (err.response) {
        logger.log('error', `Spotify API error (response) ${err.response.status}`)
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.headers)
      } else if (err.request) {
        logger.log('error', `Spotify API error (request) ${err.request}`)
        console.log(err.request)
      } else {
        logger.log('error', `Spotify API error ${err.message}`)
        console.log('Error', err.message)
      }
      console.log(err.config)
    })
}

/*
Function that retrieves an access_token, then retrieves tracks
*/
function search (query, limit) {
  return new Promise((resolve, reject) => {
    const auth = getAccessToken()
    auth
      .then(function (authRes) {
        const accessToken = authRes.data.access_token

        resolve(getTracks(query, limit, accessToken))
      })
      .catch(function (err) {
        logger.log('error', 'Spotify Authentication error %s', err)
        console.log(err)
        reject(err)
      })
  })
}

module.exports.search = search
