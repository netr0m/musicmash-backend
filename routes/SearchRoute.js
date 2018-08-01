// SearchRoute.js

const express = require('express');
const router = express.Router();

router.route('/:query').get(async (req, res) => {
    req.body.sanitized = req.sanitize(req.params.query);
    var q = req.body.sanitized.replace(/ /g, '%20');
    var spotify_controller = require('./SpotifyController');
    var soundcloud_controller = require('./SoundCloudController');
    var youtube_controller = require('./YouTubeController');

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

    function mash(tracks) {
        var mashed = {};
        soundcloud = tracks['soundcloud'];
        spotify = tracks['spotify'];
	youtube = tracks['youtube'];

        sptfy_parsed = [];
        sc_parsed = [];
	yt_parsed = [];

        soundcloud.forEach(function (track) {
            m = {
                'title': track.title,
                'duration': track.duration,
                'permlink': track.permalink_url,
                'provider': 'SoundCloud'
            };
            sc_parsed.push(m);
        });
        mashed['soundcloud'] = sc_parsed;
        spotify.forEach(function (track) {
            // TODO Add for-loop to add a few more artists if any
            m = {
                'title': track.name + ' - ' + track.artists[0].name,
                'duration': track.duration_ms,
                'permlink': track.external_urls.spotify,
                'provider': 'Spotify'
            };
            sptfy_parsed.push(m);
        });
	mashed['spotify'] = sptfy_parsed;

	yt_prefix='https://www.youtube.com/watch?v=';
	youtube.forEach(function (track) {
	    m = {
                'title': track.snippet.title,
                'duration': track.duration_ms,
                'permlink': yt_prefix + track.id.videoId,
                'provider': 'YouTube'
            };
            yt_parsed.push(m);
        });
	mashed['youtube'] = yt_parsed;

        return mashed
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
