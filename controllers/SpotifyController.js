// SpotifyRoute.js

const express = require('express');
const request = require('request');
const buildUrl = require('build-url');

const client_id = process.env.SPOTIFY_ID;
if (!client_id) { console.log('Missing CLIENT_ID for Spotify') }
const client_secret = process.env.SPOTIFY_SECRET;
if (!client_secret) { console.log('Missing CLIENT_SECRET for Spotify') }
const authBase = 'https://accounts.spotify.com/api/token';
const base = 'https://api.spotify.com/v1';

const app = express();
const router = express.Router();

function getTracks(query) {
    return new Promise((resolve, reject) => {
        var results = [];
        // Authorization
        var authOptions = {
            url: authBase,
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };
        request.post(authOptions, (e, r, b) => {
            if (!e && r.statusCode === 200) {
                var token = b.access_token;

                url = buildUrl(base, {
                    path: 'search',
                    queryParams: {
                        q: query,
                        type: 'track',
                        limit: 5
                    }
                });

                var options = {
                    url: url,
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    json: true
                };
                var tracks = request(options, (e, r, b) => {
                    if (!e && r.statusCode === 200) {
                        tracklist = b['tracks'];
                        results = tracklist['items'];
                        resolve(results);
                    } else {
                        console.log(e);
                        reject(e);
                    }
                });
            } else {
                console.log(e);
                reject(e);
            }
        });
    });
}

module.exports.getTracks = getTracks;