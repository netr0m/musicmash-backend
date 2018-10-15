const controller = require('../controllers/users')
const validateToken = require('../helpers/utils').validateToken

module.exports = (router) => {
  router.route('/users')
    .post(controller.add)
    .get(validateToken, controller.list)
  router.route('/login')
    .post(controller.login)
}
