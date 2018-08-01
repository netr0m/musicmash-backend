// SoundcloudRoute.js

const express = require('express');
const request = require('request');
const buildUrl = require('build-url');

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
