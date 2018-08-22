// SearchRoute.js

const express = require('express');
const router = express.Router();

const mash = require('../helpers/mash');

router.route('/:query').get(async (req, res) => {
    req.body.sanitized = req.sanitize(req.params.query);
    var q = req.body.sanitized.replace(/ /g, '%20');

    const spotify_controller = require('./SpotifyController');
    const soundcloud_controller = require('./SoundCloudController');
    const youtube_controller = require('./YouTubeController');

    function getTracks() {
        return new Promise((resolve, reject) => {
            var tracks = {};
            var sptfy_tracks = spotify_controller.getTracks(q);
            sptfy_tracks.then(function (sptfy_tracks) {
                tracks['spotify'] = sptfy_tracks;

                var sc_tracks = soundcloud_controller.getTracks(q);
                sc_tracks.then(function (sc_tracks) {
                    tracks['soundcloud'] = sc_tracks;

                    var yt_tracks = youtube_controller.getTracks(q);
                    yt_tracks.then(function (yt_tracks) {
                        tracks['youtube'] = yt_tracks;
                        resolve(tracks);
                    });
                });
            });
        });
    }

    var tracks = getTracks();
    tracks.then(function (tracks) {
        var trackList = mash(tracks);
        res.json(trackList);
    }, function (e) {
        console.log(e);
        res.json({ "error": "an error occurred while trying to fetch tracks" });
    })
})

module.exports = router;
