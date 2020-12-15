const { DataTypes } = require('sequelize');

module.exports = function events(sequelize) {
    return sequelize.define(
        'Event', 
        // attributes
        {
            startDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            notify: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
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