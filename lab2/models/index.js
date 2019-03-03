const Sequelize = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('user', {
//    // id:
//     {
//         type:Sequelize.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement:true,
        
//     },

    username: Sequelize.STRING,
    password: Sequelize.STRING,
 });

const products = sequelize.define('products', {
    title: Sequelize.STRING,
   
})





module.exports = {
    User,
    products
}