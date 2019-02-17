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
	
	return queryInterface.bulkInsert('products',
    [
      {title:"Anaconda dont", price: "350", created_at: new Date(), tags:["Programming"]},
      {title:"Fan", price: "50.00", created_at: new Date(), tags:["Appliances"]}
    ],{});
	
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
	return queryInterface.bulkDelete('products',
	{
      title: [
        "Anaconda dont", 
        "Fan"
      ]
    });
  }
};
