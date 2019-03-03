const Sequelize = require('sequelize');

const dbName = 'pgguide';
const dbUsername = 'postgres';
const dbPassword = '28101997';
const dbHost = 'localhost';
const dbDialect = 'postgres';

const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
    host: dbHost,
    dialect: dbDialect
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

sequelize.sync({force: false}).then(() => {
  console.log('Successfully synced to DB');
});