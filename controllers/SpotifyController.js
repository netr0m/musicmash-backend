// SpotifyController.js
const axios = require('axios')
const querystring = require('querystring')
const buildUrl = require('build-url')

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

  const authConfig = {
    headers: {
      'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  // Stringify using querystring (form)
  const body = querystring.stringify({
    grant_type: 'client_credentials'
  })

  return axios.post(url, body, authConfig)
}

/*
Function to get the tracks
*/
function getTracks (query, accessToken) {
  const base = 'https://api.spotify.com/v1'

  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  }

  // Build the full URL
  const url = buildUrl(base, {
    path: 'search',
    queryParams: {
      q: query,
      type: 'track',
      limit: 5
    }
  })

  return axios.get(url, config)
}

/*
Function that retrieves an access_token, then retrieves tracks
*/
function search (query) {
  return new Promise((resolve, reject) => {
    const auth = getAccessToken()
    auth
      .then(function (authRes) {
        const accessToken = authRes.data.access_token

        resolve(getTracks(query, accessToken))
      })
      .catch(function (err) {
        console.log(err)
        reject(err)
      })
  })
}

module.exports.search = search
