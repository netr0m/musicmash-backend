// SpotifyController.js

const request = require('request')
const buildUrl = require('build-url')

const clientID = process.env.SPOTIFY_ID
if (!clientID) { console.log('Missing clientID for Spotify') }
const clientSecret = process.env.SPOTIFY_SECRET
if (!clientSecret) { console.log('Missing clientSecret for Spotify') }
const authBase = 'https://accounts.spotify.com/api/token'
const base = 'https://api.spotify.com/v1'

function getTracks (query) {
  return new Promise((resolve, reject) => {
    var results = []
    // Authorization
    var authOptions = {
      url: authBase,
      headers: {
        'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64'))
      },
      form: {
        grant_type: 'client_credentials'
      },
      json: true
    }
    request.post(authOptions, (e, r, b) => {
      if (!e && r.statusCode === 200) {
        var token = b.access_token

        const url = buildUrl(base, {
          path: 'search',
          queryParams: {
            q: query,
            type: 'track',
            limit: 5
          }
        })

        var options = {
          url: url,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          json: true
        }
        request(options, (e, r, b) => {
          if (!e && r.statusCode === 200) {
            const tracklist = b['tracks']
            results = tracklist['items']
            resolve(results)
          } else {
            console.log(e)
            reject(e)
          }
        })
      } else {
        console.log(e)
        reject(e)
      }
    })
  })
}

module.exports.getTracks = getTracks
