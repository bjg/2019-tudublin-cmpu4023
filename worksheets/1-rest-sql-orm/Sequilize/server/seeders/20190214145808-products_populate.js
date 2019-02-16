'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('products',
    [
      {title:"Another Item", price: "10.99", created_at: new Date(), tags:["people","item"]},
      {title:"Phone", price: "120.00", created_at: new Date(), tags:["phone","technology"]},
      {title:"Book", price: "15.99", created_at: new Date(), tags:["book","reading"]}
    ],{});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('products',
    {
      title: [
        "Another Item", 
        "Phone",
        "Book"
      ]
    });
  }
};
