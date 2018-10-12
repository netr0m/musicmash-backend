// SearchRoute.js

const express = require('express')
const router = express.Router()

const mash = require('../helpers/mash')
const spotifyController = require('../controllers/SpotifyController')
const soundcloudController = require('../controllers/SoundCloudController')
const youtubeController = require('../controllers/YouTubeController')

router.route('').get(async (req, res) => {
  req.body.sanitized = req.sanitize(req.query.q)
  const q = req.body.sanitized.replace(/ /g, '%20')

  function getTracks () {
    return new Promise((resolve, reject) => {
      var tracks = {}
      var spotifyTracks = spotifyController.getTracks(q)
      spotifyTracks.then(function (spotifyTracks) {
        tracks['spotify'] = spotifyTracks

        var soundcloudTracks = soundcloudController.getTracks(q)
        soundcloudTracks.then(function (soundcloudTracks) {
          tracks['soundcloud'] = soundcloudTracks

          var youtubeTracks = youtubeController.getTracks(q)
          youtubeTracks.then(function (youtubeTracks) {
            tracks['youtube'] = youtubeTracks
            resolve(tracks)
          })
        })
      })
    })
  }

  var tracks = getTracks()
  tracks.then(function (tracks) {
    var trackList = mash(tracks)
    res.json(trackList)
  }, function (e) {
    console.log(e)
    res.json({ 'error': 'an error occurred while trying to fetch tracks' })
  })
})

module.exports = router
