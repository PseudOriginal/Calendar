const config = require('config-yml');
const { Sequelize } = require('sequelize');
 
var db = {};

db.config = { user: config.db.user, password: config.db.password, secret: config.db.secret };

// Connect to database
const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, config.db.options);

let models = [
    require('../models/user.model.js'),
    require('../models/event.model.js')
]

// Initialize models
models.forEach(model => {
    const seqModel = model(sequelize, Sequelize)
    db[seqModel.name] = seqModel
})

// Apply associations
Object.keys(db).forEach(key => {
    if ('associate' in db[key]) {
        db[key].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db