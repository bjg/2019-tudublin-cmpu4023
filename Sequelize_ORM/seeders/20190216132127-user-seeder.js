'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Sequelized_users', [{
      email: 'Pat_Baker@gmail.com',
      password: '2daysbread2day',
      details: "\"sex\"=>\"M\"",
      created_at: new Date(),
      deleted_at: new Date()
    },
    {
      email: 'MaggyT@yahoo.com',
      password: 'Rul3Br1tan1a',
      details: "\"sex\"=>\"F\"",
      created_at: new Date(),
      deleted_at: new Date()
    },
    {
      email: 'Leslie_Biggs@gmail.com',
      password: 'ChoomaIsland',
      details: "\"sex\"=>\"M\"",
      created_at: new Date(),
      deleted_at: new Date()
    },
    {
      email: 'Barry_O@gmail.com',
      password: 'Prez44',
      details: "\"sex\"=>\"M\"",
      created_at: new Date(),
      deleted_at: new Date()
    },
    {
      email: 'Deandra_R@hotmail.com',
      password: '$cammin',
      details: "\"sex\"=>\"F\"",
      created_at: new Date(),
      deleted_at: new Date()
    },], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Sequelized_users', null, {});
  }
};
