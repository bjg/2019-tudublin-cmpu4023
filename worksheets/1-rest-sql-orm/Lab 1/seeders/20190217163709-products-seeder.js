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
   return queryInterface.bulkInsert('products', [
     {
       title: 'Football',
       price: '3.99',
       created_at: today,
       tags: ['Toy', 'Sport']
     },
     {
       title: 'Bike',
       price: '109.98',
       created_at: today,
       tags: ['Toy', 'Children']
     }
   ],{});

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('products', {
     title: [
       'Bike',
       'Football'
     ]
   });
  }
};
