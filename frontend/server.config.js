let existingConf
try {
  existingConf = require('./local.server.config.js')
} catch (err) {
  existingConf = {}
}

function e (param) {
  return process.env[param] || existingConf[param] || ''
}
export default {
  DEFAULT_ROUTE: e('DEFAULT_ROUTE')
}