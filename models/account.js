'use strict';

module.exports = function(sequelize, DataTypes) {
    var Account = sequelize.define('Account', {
        id: {
            primaryKey: true,
            type: DataTypes.STRING
        },
        username: {
            type: DataTypes.STRING,
            unique: true
        },
        password: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Account.hasMany(models.Comment);
            }
        }
    });

    return Account;
};
