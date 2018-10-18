// server.js

const express = require('express')
const bodyParser = require('body-parser')
const expressSanitizer = require('express-sanitizer')
const compression = require('compression')
const helmet = require('helmet')

const routes = require('./routes/index')

const app = express()
const router = express.Router()

const environment = process.env.NODE_ENV
const stage = require('./config')[environment]
const PORT = stage.port

if (environment !== 'production') {
  const logger = require('morgan')
  app.use(logger('dev'))
}

app.use(bodyParser.json())
app.use(expressSanitizer())
app.use(compression())
app.use(helmet())

app.use('/v1', routes(router))

app.listen(PORT, function () {
  console.log('musicmash-backend running on :', PORT)
})
