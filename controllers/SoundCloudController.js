// SoundcloudRoute.js

const express = require('express');
const request = require('request');
const buildUrl = require('build-url');

const client_id = process.env.SOUNDCLOUD_ID;
if (!client_id) { console.log('Missing CLIENT_ID for Soundcloud') }
const base = 'https://api-v2.soundcloud.com';

const app = express();
const router = express.Router();

function getTracks(query) {
    return new Promise((resolve, reject) => {

        url = buildUrl(base, {
            path: 'search',
            queryParams: {
                q: query,
                client_id: client_id,
                limit: 5,
                offset: 0,
                app_locale: 'en'
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
                results = b['collection'];
                resolve(results);
            } else {
                console.log(e);
                reject(e);
            }
        });
    });
}

module.exports.getTracks = getTracks;