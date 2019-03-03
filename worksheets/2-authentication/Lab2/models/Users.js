const sequelize = require('sequelize')
const db = require('../config/database')

const Users = db.define('users', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    username: {
        type: sequelize.STRING
    },
    password: {
        type: sequelize.STRING
    },
    token: {
        type: sequelize.STRING
    }
}, {timestamps: false})

module.exports = Users;