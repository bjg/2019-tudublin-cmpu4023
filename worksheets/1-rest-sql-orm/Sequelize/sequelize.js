const Sequelize = require('sequelize');
const UsersModel = require('./models/users');
const ProductsModel = require('./models/products');

const sequelize = new Sequelize('pgguide', '[YOUR USER]', '[YOUR PASS]', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const Users = UsersModel(sequelize, Sequelize);
const Products = ProductsModel(sequelize, Sequelize);

sequelize.sync({ force: false })
    .then(() => {
        console.log(`Database & tables created!`)
    });

module.exports = {
    Users,
    Products
};