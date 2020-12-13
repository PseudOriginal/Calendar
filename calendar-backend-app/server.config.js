let existingConf
try {
  existingConf = require('./local.server.config.js')
} catch (err) {
  existingConf = {}
}

module.exports = function e (param) {
  return process.env[param] || existingConf[param] || ''
}