const { DataTypes } = require('sequelize');

module.exports = function events(sequelize) {
    return sequelize.define(
        'Event', 
        // attributes
        {
            start_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            end_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            description: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false
            }
        }, 
        // options
        {
            tableName: 'Event',
            timestamps: false
        })
}