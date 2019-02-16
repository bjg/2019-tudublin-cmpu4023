const sequelize = require('sequelize')
const db = require('../config/database')

const Purchases = db.define('purchases', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    created_at: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    name: {
        type: sequelize.STRING
    },
    address: {
        type: sequelize.STRING
    },
    state: {
        type: sequelize.STRING
    },
    zipcode: {
        type: sequelize.INTEGER
    },
    user_id: {
        type: sequelize.INTEGER
    }
}, {timestamps: false})

module.exports = Purchases;