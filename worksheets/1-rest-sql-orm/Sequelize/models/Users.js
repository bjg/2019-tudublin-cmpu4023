const sequelize = require('sequelize')
const db = require('../config/database')

const Users = db.define('users', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: sequelize.STRING
    },
    password: {
        type: sequelize.STRING
    },
    details: {
        type: sequelize.HSTORE
    },
    created_at: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    deleted_at: {
        type: 'TIMESTAMP',
    }
}, {timestamps: false})

module.exports = Users;