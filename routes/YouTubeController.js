// SoundcloudRoute.js

const express = require('express');
const request = require('request');
const buildUrl = require('build-url');
const moment = require('moment');

const api_key = process.env.YOUTUBE_KEY;
if (!api_key) { console.log('Missing API_KEY for Soundcloud') }
const base = 'https://www.googleapis.com/youtube/v3';

const app = express();
const router = express.Router();

function getTracks(query) {
    return new Promise((resolve, reject) => {

        url = buildUrl(base, {
            path: 'search',
            queryParams: {
                q: query,
                type: 'video',
                maxResults: 5,
                part: 'snippet',
                order: 'relevance',
                key: api_key
            }
        });

        var options = {
            url: url,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            json: true
        };
        var tracks = request(options, (e, r, b) => {
            if (!e && r.statusCode === 200) {
                var results = [];

                // Get the tracks
                trackList = b['items'];

                var trackIds = [];
                var details = {};

                // Get the track IDs
                for (var i = 0; i < trackList.length; i++) {
                    var id = trackList[i].id.videoId;
                    trackIds.push(id);
                };

                // Get the contentDetails for the tracks
                trackDetails = getContentDetails(trackIds);
                
                trackDetails.then(function (trackDetails) {
                    trackDetails.forEach(function (trackDetail) {
                        var id = trackDetail.id;
                        var duration = trackDetail.contentDetails.duration;
                        details[id] = duration;
                    });
                    trackList.forEach(function (result) {
                        var id = result.id.videoId;
                        console.log(`${details[id]} = ${moment.duration(details[id]).asMilliseconds()}`);
                        result.duration = moment.duration(details[id]).asMilliseconds();
                        results.push(result);
                    });
                }).then(function (tracks) {
                    resolve(results);
                });
            } else {
                console.log(e);
                reject(e);
            }
        });
    });
}

function getContentDetails(trackIds) {
    return new Promise((resolve, reject) => {
        url = buildUrl(base, {
            path: 'videos',
            queryParams: {
                id: trackIds.toString(),
                part: 'contentDetails',
                key: api_key
            }
        });

        var options = {
            url: url,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            json: true
        };

        var trackDetails = request(options, (e, r, b) => {
            if (!e && r.statusCode === 200) {
                results = b['items'];
                resolve(results);
            } else {
                console.log(e);
                reject(e);
            }
        });
    });
}

module.exports.getTracks = getTracks;
