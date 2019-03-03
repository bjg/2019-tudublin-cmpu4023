const Sequelize = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('users', {
    login: Sequelize.STRING,
    password: Sequelize.STRING,
    accesskey: Sequelize.STRING,
    secretkey: Sequelize.STRING
});

const Product = sequelize.define('products', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        defaultValue: Sequelize.literal('DEFAULT')
    },
    title: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.NUMERIC
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.STRING)
    }
});


module.exports = {
    User,
    Product
}