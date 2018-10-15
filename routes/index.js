const search = require('./search')
const users = require('./users')

module.exports = (router) => {
  search(router)
  users(router)
  return router
}
