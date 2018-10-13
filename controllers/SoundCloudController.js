// SoundcloudController.js

const request = require('request')
const buildUrl = require('build-url')

const clientID = process.env.SOUNDCLOUD_ID
if (!clientID) { console.log('Missing clientID for Soundcloud') }
const base = 'https://api-v2.soundcloud.com'

function getTracks (query) {
  return new Promise((resolve, reject) => {
    const url = buildUrl(base, {
      path: 'search',
      queryParams: {
        q: query,
        clientID: clientID,
        limit: 5,
        offset: 0,
        app_locale: 'en'
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
        const results = b['collection']
        resolve(results)
      } else {
        console.log(e)
        reject(e)
      }
    })
  })
}

module.exports.getTracks = getTracks
