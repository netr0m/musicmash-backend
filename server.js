// server.js

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const SearchRoute = require('./routes/SearchRoute');
const SpotifyRoute = require('./routes/SpotifyRoute');
const SoundcloudRoute = require('./routes/SoundCloudRoute');

const PORT = 5000;

app.use(bodyParser.json());
app.use('/search', SearchRoute);
app.use('/spotify', SpotifyRoute);
app.use('/soundcloud', SoundcloudRoute);

app.listen(PORT, function() {
    console.log('musicmash-backend running on :', PORT);
});