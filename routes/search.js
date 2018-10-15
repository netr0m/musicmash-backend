const controller = require('../controllers/search')
const validateToken = require('../helpers/utils').validateToken

module.exports = (router) => {
  router.route('/search')
    .get(validateToken, controller.search)
}
