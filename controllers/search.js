const axios = require('axios')

const logger = require('../helpers/logger')
const mash = require('../helpers/mash')
const spotifyController = require('./SpotifyController')
const soundcloudController = require('./SoundCloudController')
const youtubeController = require('./YouTubeController')

function getTracks (query, limit) {
  var tracks = {}

  return new Promise((resolve, reject) => {
    // Execute the functions concurrently
    axios.all([spotifyController.search(query, limit), soundcloudController.search(query, limit), youtubeController.search(query, limit)])
      .then(axios.spread(function (spotifyResult, soundcloudResult, youtubeResult) {
        tracks['spotify'] = spotifyResult.data.tracks
        tracks['soundcloud'] = soundcloudResult.data.collection
        tracks['youtube'] = youtubeResult
        resolve(tracks)
      }))
      .catch(function (err) {
        if (err.response) {
          logger.log('error', `API error (response) ${err.response.data}`)
          console.log(err.response.data)
          console.log(err.response.status)
          console.log(err.response.headers)
        } else if (err.request) {
          logger.log('error', `API error (request) ${err.request}`)
          console.log(err.request)
        } else {
          logger.log('error', `API error ${err.message}`)
          console.log('Error', err.message)
        }
        logger.log('error', `API error ${err.config}`)
        console.log(err.config)
        reject(err)
      })
  })
}

const api = {
  search: (req, res) => {
    req.body.sanitized = {}
    req.body.sanitized.q = req.sanitize(req.query.q)
    req.body.sanitized.limit = req.sanitize(req.query.limit)
    const q = req.body.sanitized.q.replace(/ /g, '+')
    const l = req.body.sanitized.limit <= 50 ? req.body.sanitized.limit : 5

    const tracks = getTracks(q, l)

    tracks
      .then(function (tracks) {
        const trackList = mash(tracks)
        res.json(trackList)
      })
      .catch(function (err) {
        logger.log('error', 'Mash error')
        console.log(err)
        res.json({ 'success': false, 'message': 'An error occurred while fetching the tracks' })
      })
  }
}

module.exports = api
