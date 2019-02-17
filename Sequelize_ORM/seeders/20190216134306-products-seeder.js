'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Sequelized_products', [{
      title: 'How to Bake',
      price: '11.99',
      created_at: new Date(),
      deleted_at: new Date(),
      tags: ["Book", "Cooking"]
    },
    {
      title: 'Guitar Man',
      price: '18.99',
      created_at: new Date(),
      deleted_at: new Date(),
      tags: ["Music"]
    },
    {
      title: 'Dreams From My Father',
      price: '13.95',
      created_at: new Date(),
      deleted_at: new Date(),
      tags: ["Book", "Biography"]
    },
    {
      title: 'Satanic Bible',
      price: '6.66',
      created_at: new Date(),
      deleted_at: new Date(),
      tags: ["Book", "Religous"]
    },
    {
      title: 'Scooter',
      price: '119.85',
      created_at: new Date(),
      deleted_at: new Date(),
      tags: ["Technology", "Motor Vechicle"]
    },
    {
      title: 'Coffee Press',
      price: '15.00',
      created_at: new Date(),
      deleted_at: new Date(),
      tags: ["Technology", "Appliance"]
    },], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Sequelized_products', null, {});
  }
};
