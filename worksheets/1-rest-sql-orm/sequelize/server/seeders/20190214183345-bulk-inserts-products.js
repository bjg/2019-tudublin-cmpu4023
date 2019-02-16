'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    var today = new Date();
    return queryInterface.bulkInsert('products', [
      {
        title: 'Kite',
        price: '3.99',
        created_at: today,
        tags: ['Toy', 'Children']
      },
      {
        title: 'Bike',
        price: '113.99',
        created_at: today,
        tags: ['Toy', 'Children']
      }
    ], {});
},
down: (queryInterface, Sequelize) =>{
    return queryInterface.bulkDelete('products', {
      title: [
        'Bike',
        'Kite'
      ]
    });
  }
};


