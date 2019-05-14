const sequelize = require('sequelize')
const db = require('../config/database')

const Purchase_Items = db.define('purchase_items', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    purchase_id: {
        type: sequelize.INTEGER
    },
    product_id: {
        type: sequelize.INTEGER
    },
    price: {
        type: sequelize.NUMERIC
    },
    quantity: {
        type: sequelize.INTEGER
    },
    state: {
        type: sequelize.STRING
    }
}, {timestamps: false})

module.exports = Purchase_Items;