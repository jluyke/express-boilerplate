'use strict';
var randomUtils = require('./../utils/randomUtils.js');

module.exports = function(sequelize, DataTypes) {
    var Session = sequelize.define('Session', {
        id: {
            primaryKey: true,
            type: DataTypes.STRING
        },
        ownerId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expiresAt: DataTypes.DATE
    });

    return Session;
};
