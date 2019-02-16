'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
      var today = new Date();
      return queryInterface.bulkInsert('purchases', [
        {
          created_at: today,
          name: 'John Doe',
          address: '123 Fake Street',
          state: 'NY',
          zipcode: '90210',
          user_id: '3'
        },
        {
          created_at: today,
          name: 'Mary Byrne',
          address: '999 World Street',
          state: 'CA',
          zipcode: '90210',
          user_id: '12'
        }
      ], {});
  },
  down: (queryInterface, Sequelize) =>{
      return queryInterface.bulkDelete('purchases', {
        name: [
          'John Doe',
          'Mary Byrne'
        ]
      });
}};


