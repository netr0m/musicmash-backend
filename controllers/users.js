const mongoose = require('mongoose')
const User = require('../schemas/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const config = require('../config')

const users = {
  add: (req, res) => {
    mongoose.connect(config.dbstring, { useNewUrlParser: true }, (err) => {
      let result = {}
      let status = 201

      if (!err) {
        const { email, username, password } = req.body
        const user = new User({ email, username, password })
        // Todo: Hash here rather than in the schema?
        user.save((err, user) => {
          if (!err) {
            result.status = status
            result.result = {
              email: user.email,
              username: user.username
            }
          } else {
            status = 500
            result.status = status
            result.error = err
          }
          res.status(status).send(result)
        })
      } else {
        status = 500
        result.status = status
        result.error = err
        res.status(status).send(result)
      }
    })
  },
  login: (req, res) => {
    const { username, password } = req.body

    mongoose.connect(config.dbstring, { useNewUrlParser: true }, (err) => {
      let result = {}
      let status = 200

      if (!err) {
        User.findOne({ username }, (err, user) => {
          if (!err && user) {
            bcrypt.compare(password, user.password).then(match => {
              if (match) {
                status = 200
                // Create the token
                const payload = { email: user.email, username: user.username, admin: user.admin }
                const options = { expiresIn: '7d', issuer: 'https://api.musicmash.xyz' }
                const secret = process.env.APP_SECRET
                const token = jwt.sign(payload, secret, options)

                result.token = token
                result.status = status
              } else {
                status = 401
                result.status = status
                result.error = 'Authentication error'
              }
              res.status(status).send(result)
            }).catch(err => {
              status = 500
              result.status = status
              result.error = err
              res.status(status).send(result)
            })
          } else {
            status = 404
            result.status = status
            result.error = err
            res.status(status).send(result)
          }
        })
      } else {
        status = 500
        result.status = status
        result.error = err
        res.status(status).send(result)
      }
    })
  },
  list: (req, res) => {
    mongoose.connect(config.dbstring, { useNewUrlParser: true }, (err) => {
      let result = {}
      let status = 200
      if (!err) {
        const payload = req.decoded
        if (payload && payload.admin) {
          User.find({}, '_id admin email username __v', (err, users) => {
            if (!err) {
              result.status = status
              result.error = err
              result.result = users
            } else {
              status = 500
              result.status = status
              result.error = err
            }
            res.status(status).send(result)
          })
        } else {
          status = 401
          result.status = status
          result.error = 'Authentication error'
          res.status(status).send(result)
        }
      } else {
        status = 500
        result.status = status
        result.error = err
        res.status(status).send(result)
      }
    })
  },
  verify: (req, res) => {
    let result = {}
    let status = 200
    const payload = req.decoded
    if (payload) {
      result.status = status
      result.decoded = payload
    } else {
      status = 401
      result.status = status
      result.error = 'Authentication error'
    }
    res.status(status).send(result)
  }
}

module.exports = users
