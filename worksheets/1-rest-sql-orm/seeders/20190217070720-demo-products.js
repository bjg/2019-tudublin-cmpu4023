'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('products', [
        {
          title: 'Cape',
          price: '250',
          tags: 'Superhero Atire',
          created_at: '2009-03-08 03:06:00+00',
          deleted_at: '2009-03-08 03:06:00+00',
          createdAt: '2009-03-08 03:06:00+00',
          updatedAt: '2009-03-08 03:06:00+00'
        },
        {
          title: 'Batarangs',
          price: 450,
          tags: 'Weapons',
          created_at: '2010-11-12 21:27:00+00',
          deleted_at: '2010-11-12 21:27:00+00',
          createdAt: '2010-11-12 21:27:00+00',
          updatedAt: '2010-11-12 21:27:00+00'
        },
        {
          title: 'Bracers',
          price: 233.33,
          tags: 'Armour',
          created_at: '2009-12-20 20:36:00+00',
          deleted_at: '2009-12-20 20:36:00+00',
          createdAt: '2009-12-20 20:36:00+00',
          updatedAt: '2009-12-20 20:36:00+00'
        }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('products', null, {});
  }
};
