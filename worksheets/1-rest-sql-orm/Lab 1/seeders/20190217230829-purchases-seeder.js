'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   var today = new Date();
   return queryInterface.bulkInsert('purchases', [
     {
       created_at: today,
       name: 'John Malone',
       address: '742 Evergreen Tce',
       state: 'NY',
       zipcode: '90876',
       user_id: '3'
     },
     {
      created_at: today,
      name: 'Mary Magoo',
      address: '999 Kilcogy',
      state: 'CA',
      zipcode: '12349',
      user_id: '12'
    }
   ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('purchases', {
     name: [
       'John Malone',
       'Mary Magoo'
     ]
   });
  }
};
