const jwt = require('jsonwebtoken')

const utils = {
  validateToken: (req, res, next) => {
    const authorizationHeader = req.headers.authorization
    let result
    if (authorizationHeader) {
      const token = req.headers.authorization.split(' ')[1]
      const options = { expiresIn: '7d', issuer: 'https://brewsource.no' }
      try {
        result = jwt.verify(token, process.env.APP_SECRET, options)

        req.decoded = result
        next()
      } catch (err) {
        throw new Error(err)
      }
    } else {
      result = {
        error: 'Authentication error. Token is required',
        status: 401
      }
      res.status(401).send(result)
    }
  }
}

module.exports = utils
