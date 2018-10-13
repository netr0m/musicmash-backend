// SearchRoute.js

const express = require('express')
const router = express.Router()
const axios = require('axios')

const mash = require('../helpers/mash')
const spotifyController = require('../controllers/SpotifyController')
const soundcloudController = require('../controllers/SoundCloudController')
const youtubeController = require('../controllers/YouTubeController')

function getTracks (query) {
  var tracks = {}

  return new Promise((resolve, reject) => {
    // Execute the functions concurrently
    axios.all([spotifyController.search(query), soundcloudController.search(query), youtubeController.search(query)])
      .then(axios.spread(function (spotifyResult, soundcloudResult, youtubeResult) {
        tracks['spotify'] = spotifyResult.data.tracks.items
        tracks['soundcloud'] = soundcloudResult.data.collection
        tracks['youtube'] = youtubeResult
        resolve(tracks)
      }))
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
        reject(err)
      })
  })
}

router.route('').get((req, res) => {
  req.body.sanitized = req.sanitize(req.query.q)
  const q = req.body.sanitized.replace(/ /g, '+')

  const tracks = getTracks(q)

  tracks
    .then(function (tracks) {
      // res.json(tracks['spotify'])
      const trackList = mash(tracks)
      res.json(trackList)
    })
    .catch(function (err) {
      console.log(err)
      res.json({ 'success': false, 'message': 'An error occurred while fetching the tracks' })
    })
})

module.exports = router
