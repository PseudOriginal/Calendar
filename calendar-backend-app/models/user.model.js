const { DataTypes } = require('sequelize');

module.exports = function users(sequelize) {
    return sequelize.define(
        'User', 
        // attributes
        {
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                primaryKey: true
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false
            }
        }, 
        // options
        {
            tableName: 'User',
            timestamps: false,
            defaultScope: {
                // excluse hash by default
                attributes: { exclude: ['password'] }
            },
            scopes: {
                // include hash with this scope
                withHashPassword: { attributes: {}, }
            }
        })
}