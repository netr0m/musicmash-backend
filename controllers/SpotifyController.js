// SpotifyController.js
const axios = require('axios')
const querystring = require('querystring')
const buildUrl = require('build-url')

/*
Function to get an access token for authorization
*/
function getAccessToken () {
  const clientID = process.env.SPOTIFY_ID
  if (!clientID) { console.log('Missing clientID for Spotify') }
  const clientSecret = process.env.SPOTIFY_SECRET
  if (!clientSecret) { console.log('Missing clientSecret for Spotify') }

  const authBase = 'https://accounts.spotify.com/api/token'

  const authConfig = {
    headers: {
      'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  const body = querystring.stringify({
    grant_type: 'client_credentials'
  })

  return axios.post(authBase, body, authConfig)
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

/*
Function to get the tracks
*/
function getTracks (query) {
  const base = 'https://api.spotify.com/v1'

  // Get the access token
  const getToken = getAccessToken()
  getToken
    .then(function (res) {
      const accessToken = res.data.access_token
      const config = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      }

      const url = buildUrl(base, {
        path: 'search',
        queryParams: {
          q: query,
          type: 'track',
          limit: 5
        }
      })

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
    })
}

module.exports.getTracks = getTracks
