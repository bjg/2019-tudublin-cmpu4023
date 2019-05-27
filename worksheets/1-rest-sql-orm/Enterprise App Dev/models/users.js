//Lab 1
//User model

'use strict';
module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        details: DataTypes.STRING
    }, {});

    users.associate = function(models) {
        // associations can be defined here
    };


    return users;
};