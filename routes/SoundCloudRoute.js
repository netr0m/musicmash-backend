// SoundcloudRoute.js

const express = require('express');
const request = require('request');
const buildUrl = require('build-url');

const client_id = process.env.SOUNDCLOUD_ID;
if (!client_id){console.log('Missing CLIENT_ID for Soundcloud')}
const base = 'https://api-v2.soundcloud.com';

const app = express();
const router = express.Router();

router.route('/:query').get(async (req, res) => {

    var q = req.params.query;

    url = buildUrl(base, {
        path: 'search',
        queryParams: {
            q: q,
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
            'Content-Type': 'application/json',

        },
        json: true
    };
    var tracks = await request(options, async (e, r, b) => {
        results = await b['collection'];
        res.json(results)
        return results
    });
})

    module.exports = router;
// https://api-v2.soundcloud.com/search?q=smile%20like%20you%20mean%20it%20the%20killers&client_id=l4PHY7uZcvjhy51g4F3aDiLbjSR1t09C&limit=5&offset=0&app_locale=en