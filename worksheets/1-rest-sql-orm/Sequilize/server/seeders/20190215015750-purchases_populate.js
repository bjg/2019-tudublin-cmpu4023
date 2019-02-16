'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('purchases',
    [
      //created_at: ,name: , address:, state: , zipcode: ,user_id:
      {created_at: new Date(),name:"Jasabel White", address: "321 MLK Ave", state:"VA", zipcode:"98937", user_id:"7"},
      {created_at: new Date(),name:"Jason Bughem", address: "99 Georgia Lane", state:"TX", zipcode:"25741", user_id:"33"},
      {created_at: new Date(),name:"Dr. Einsehour", address: "90210 Belverly Hills", state:"CA", zipcode:"21581", user_id:"11"}
    ],{});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('purchases',
    [
      {name:"Jasabel White", address: "321 MLK Ave", state:"VA", zipcode:"98937", user_id:"7"},
      {name:"Jason Bughem", address: "99 Georgia Lane", state:"TX", zipcode:"25741", user_id:"33"},
      {name:"Dr. Einsehour", address: "90210 Belverly Hills", state:"CA", zipcode:"21581", user_id:"11"}
    ],{});
  }
};
