const config = {}

config.dbstring = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`
config.development = {
  port: process.env.PORT || 3000,
  saltingRounds: 9
}
config.production = {
  port: process.env.PORT || 8080,
  saltingRounds: 9
}

module.exports = config
