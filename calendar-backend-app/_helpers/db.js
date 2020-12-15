//const config = require('config-yml');
const config = require('../server.config.js')
const { Sequelize } = require('sequelize');
 
var db = {};

db.config = { user: config('dbUser'), password: config('dbPassword'), secret: config('dbSecret') };

// Connect to database
const sequelize = new Sequelize(config('dbDatabase'), config('dbUser'), config('dbPassword'), {
    host: config('dbOptionsHost'),
    port: config('dbOptionsPort'),
    dialect: config('dbOptionsDialect'),
    logging: false,
    define: {
        freezeTableName: config('dbOptionsDefineFreezeTableName'),
        pool: {
            max: config('dbOptionsDefinePoolMax'),
            min: config('dbOptionsDefinePoolMin'),
            acquire: config('dbOptionsDefinePoolAcquire'),
            idle: config('dbOptionsDefinePoolIdle'),
        },
        operatorsAliases: config('dbOptionsDefineOperatorsAliases'),
        connectTimeout: config('dbOptionsDefineConnectTimeout')
    }
});

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