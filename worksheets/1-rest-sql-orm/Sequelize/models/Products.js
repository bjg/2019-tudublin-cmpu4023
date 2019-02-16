const sequelize = require('sequelize')
const db = require('../config/database')

const Products = db.define('products', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: sequelize.STRING
    },
    price: {
        type: sequelize.NUMERIC
    },
    created_at: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    deleted_at: {
        type: 'TIMESTAMP'
    },
    tags: {
        type: sequelize.STRING
    },
}, {timestamps: false})

module.exports = Products;