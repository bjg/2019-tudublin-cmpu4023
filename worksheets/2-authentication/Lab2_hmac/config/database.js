const Sequelize = require('sequelize');

//Set db connection parameters
//Initialize the db connection
module.exports = new Sequelize('EAD_LAB2', 'postgres', 'Ibanezrg320dx',
{
    host: 'localhost',
    dialect: 'postgres',
  
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
});



