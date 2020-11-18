const config = require('../config.json');
const { Sequelize } = require('sequelize');
 
var db = {};

const { user, password, database, options } = config.db;
    
// Connect to database
const sequelize = new Sequelize(database, user, password, options);

let models = [
    require('../models/user.model.js')
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