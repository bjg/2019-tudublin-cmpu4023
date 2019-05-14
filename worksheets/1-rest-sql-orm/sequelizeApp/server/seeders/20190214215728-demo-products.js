'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('SeqProducts', [{
        title: "Python Book",
        price: 29.99,
        created_at: new Date(),
        tags: ["Book", "Programming", "Python"]
      }, {
        title: "Premier League Football",
        price: 19.99,
        created_at: new Date(),
        tags: ["Sports", "Football", "Nike"]
      }, {
        title: "42 Inch 4K UltraHD TV",
        price: 459.99,
        created_at: new Date(),
        tags: ["Technology", "TV", "Entertainment", "Samsung"]
      }, {
        title: "Toothbrush",
        price: 8.99,
        created_at: new Date(),
        tags: ["Healthcare", "Hygiene"]
      }, {
        title: "Bottle of Red Wine",
        price: 14.99,
        created_at: new Date(),
        tags: ["Alcohol", "Wine", "Red"]
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
