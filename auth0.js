const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');

const tokenGuard = jwt({
    // Fetch the signing key based onm the KID in the header and
    // the signing keys provided by the JWKS endpoint
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: 'https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json'
    }),

    // Validate the audience and the issuer
    audience: process.env.AUTH0_AUDIENCE,
    issuer: 'https://${process.env.AUTH0_DOMAIN}/',
    algorithms: ['RS256']
});

module.exports = function (scopes) {
    const scopesGuard = jwtAuthz(scopes || []);
    return function mid(req, res, next) {
        tokenGuard(req, res, (err) => {
            err ? res.status(500).send(err) : scopesGuard(req, res, next);
        });
    }
}
