// SearchRoute.js

const express = require('express');
const request = require('request');
const buildUrl = require('build-url');
const Q = require('q');

var client_id = process.env.SOUNDCLOUD_ID;
if (!client_id) { console.log('Missing CLIENT_ID for Soundcloud') }
const sc = 'soundcloud';
const sptfy = 'spotify';
const base = 'http://localhost:4000'

var tracks = {};

const app = express();
const router = express.Router();

router.route('/:query').get(async (req, res) => {
    var q = req.params.query.replace(/ /g, '%20');
    var spotify_controller = require('./SpotifyController');
    var scEndpoint = sc + '/' + q;
    var sptfyEndpoint = sptfy + '/' + q;

    scUrl = buildUrl(base, {
        path: scEndpoint
    });
    sptfyUrl = buildUrl(base, {
        path: sptfyEndpoint
    });

    var scOptions = {
        url: scUrl,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };
    var sptfyOptions = {
        url: sptfyUrl,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    function getTracks() {
        return new Promise((resolve, reject) => {
            var spottracks = spotify_controller.getTracks(q);
            spottracks.then(resolve({ 'results': spottracks }));
                /*} else {
                    console.log(e);
                    res.json({"error": "an error occurred while trying to fetch tracks"});
                    reject(e);
                }
        });*/
        });
    }

    /*function getTracks() {
        return new Promise((resolve, reject) => {
            request(scOptions, (e, r, b) => {
                if (!e) {
                    results = JSON.parse(b);
                    tracks['soundcloud'] = results;
                } else {
                    console.log(e);
                    res.json({"error": "an error occurred while trying to fetch tracks"});
                    reject(e);
                }
            });
            request(sptfyOptions, (e, r, b) => {
                if (!e) {
                    results = JSON.parse(b);
                    tracks['spotify'] = results;
                    resolve({ r, b });
                } else {
                    console.log(e);
                    res.json({"error": "an error occurred while trying to fetch tracks"});
                    reject(e);
                }
            });
        });
    }*/

    function mash(tracks) {
        var mashed = []
        soundcloud = tracks['soundcloud'];
        spotify = tracks['spotify'];

        soundcloud.forEach(function (track) {
            m = {
                'title': track.title,
                'duration': track.duration,
                'permlink': track.permalink_url,
                'provider': 'SoundCloud'
            };
            mashed.push(m);
        });
        spotify.forEach(function (track) {
            m = {
                'title': track.name + ' - ' + track.artists[0].name,
                'duration': track.duration_ms,
                'permlink': track.external_urls.spotify,
                'provider': 'Spotify'
            };
            mashed.push(m);
        });

        return mashed
    }

    var tracks = getTracks();
    tracks.then(function (r) {
        //tl = r;
        console.log('--------------TRACKS------------')
        //console.log(tracks);
        console.log(r['results']);
        var results = r['results'];
        //console.log(results);
        //var trackList = mash(tracks);
        res.json(results);
    }, function (e) {
        console.log(e);
        res.json({ "error": "an error occurred while trying to fetch tracks" });
    })
})

module.exports = router;