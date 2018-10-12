// SoundcloudController.js

const request = require('request')
const buildUrl = require('build-url')
const moment = require('moment')

const apiKey = process.env.YOUTUBE_KEY
if (!apiKey) { console.log('Missing apiKey for Soundcloud') }
const base = 'https://www.googleapis.com/youtube/v3'

function getTracks (query) {
  return new Promise((resolve, reject) => {
    const url = buildUrl(base, {
      path: 'search',
      queryParams: {
        q: query,
        type: 'video',
        maxResults: 5,
        part: 'snippet',
        order: 'relevance',
        key: apiKey
      }
    })

    var options = {
      url: url,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      json: true
    }
    request(options, (e, r, b) => {
      if (!e && r.statusCode === 200) {
        var results = []

        // Get the tracks
        const trackList = b['items']

        var trackIds = []
        var details = {}

        // Get the track IDs
        for (var i = 0; i < trackList.length; i++) {
          var id = trackList[i].id.videoId
          trackIds.push(id)
        };

        // Get the contentDetails for the tracks
        const trackDetails = getContentDetails(trackIds)

        trackDetails.then(function (trackDetails) {
          trackDetails.forEach(function (trackDetail) {
            var id = trackDetail.id
            var duration = trackDetail.contentDetails.duration
            details[id] = duration
          })
          trackList.forEach(function (result) {
            var id = result.id.videoId
            result.duration = moment.duration(details[id]).asMilliseconds()
            results.push(result)
          })
        }).then(function (tracks) {
          resolve(results)
        })
      } else {
        console.log(e)
        reject(e)
      }
    })
  })
}

function getContentDetails (trackIds) {
  return new Promise((resolve, reject) => {
    const url = buildUrl(base, {
      path: 'videos',
      queryParams: {
        id: trackIds.toString(),
        part: 'contentDetails',
        key: apiKey
      }
    })

    var options = {
      url: url,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      json: true
    }

    request(options, (e, r, b) => {
      if (!e && r.statusCode === 200) {
        const results = b['items']
        resolve(results)
      } else {
        console.log(e)
        reject(e)
      }
    })
  })
}

module.exports.getTracks = getTracks
