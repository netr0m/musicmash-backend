// YouTubeController.js

const axios = require('axios')
const buildUrl = require('build-url')
const moment = require('moment')

const logger = require('../helpers/logger')

const apiKey = process.env.YOUTUBE_KEY
if (!apiKey) { console.log('Missing apiKey for Soundcloud') }
const baseUrl = 'https://www.googleapis.com/youtube/v3'

function getTracks (query, limit) {
  const url = buildUrl(baseUrl, {
    path: 'search',
    queryParams: {
      q: query,
      type: 'video',
      maxResults: limit,
      part: 'snippet',
      order: 'relevance',
      key: apiKey
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
        logger.log('error', `YouTube API error (response) ${err.response.status}`)
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.headers)
      } else if (err.request) {
        logger.log('error', `YouTube API error (request) ${err.request}`)
        console.log(err.request)
      } else {
        logger.log('error', `YouTube API error ${err.message}`)
        console.log('Error', err.message)
      }
      console.log(err.config)
    })
}

function getContentDetails (trackIds) {
  const url = buildUrl(baseUrl, {
    path: 'videos',
    queryParams: {
      id: trackIds.toString(),
      part: 'contentDetails',
      key: apiKey
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
        logger.log('error', `YouTube (details) API error (response) ${err.response.status}`)
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.headers)
      } else if (err.request) {
        logger.log('error', `YouTube (details) API error (request) ${err.request}`)
        console.log(err.request)
      } else {
        logger.log('error', `YouTube (details) API error ${err.message}`)
        console.log('Error', err.message)
      }
      console.log(err.config)
    })
}

function search (query, limit) {
  var results = []

  return new Promise((resolve, reject) => {
    const tracks = getTracks(query, limit)
    tracks
      .then(function (tracksRes) {
        const trackList = tracksRes.data.items

        var trackIds = []
        var details = {}

        // Get the track IDs
        for (var i = 0; i < trackList.length; i++) {
          var id = trackList[i].id.videoId
          trackIds.push(id)
        };

        // Get the contentDetails for the tracks
        const trackDetails = getContentDetails(trackIds)
        trackDetails
          .then(function (trackDetailsRes) {
            const items = trackDetailsRes.data.items
            items.forEach(function (trackDetail) {
              const id = trackDetail.id
              const duration = trackDetail.contentDetails.duration
              details[id] = duration
            })
            trackList.forEach(function (result) {
              const id = result.id.videoId
              result.duration = moment.duration(details[id]).asMilliseconds()
              results.push(result)
            })
          })
          .then(function () {
            resolve(results)
          })
          .catch(function (err) {
            logger.log('error', 'YouTube API error %s', err)
            console.log(err)
            reject(err)
          })
      })
      .catch(function (err) {
        logger.log('error', 'YouTube API error %s', err)
        console.log(err)
        reject(err)
      })
  })
}

module.exports.search = search
