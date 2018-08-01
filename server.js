// server.js

const express = require('express');
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const SearchRoute = require('./routes/SearchRoute');

const PORT = 5000;

app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(compression());
app.use(helmet());

app.use('/search', SearchRoute);

app.listen(PORT, function() {
    console.log('musicmash-backend running on :', PORT);
});
