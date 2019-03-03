const sequelize = require('sequelize')
const db = require('../config/database')

const Products = db.define('products', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: sequelize.STRING
    },
    price: {
        type: sequelize.NUMERIC
    }
    
}, {timestamps: false})

module.exports = Products;