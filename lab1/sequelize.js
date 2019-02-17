const Sequelize = require('sequelize')
const { users } = require('./models/')

const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/pgguide');

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});

users.findAll().then(users => console.log(users))

