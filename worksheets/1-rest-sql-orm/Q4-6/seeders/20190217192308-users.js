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
	
	return queryInterface.bulkInsert('users',
    [
      {email:"erika@gmail.com", password:"735dba8760996aafd1b08b443c6fa4f9", details:'"sex" => "F"', created_at: new Date()},
      {email:"mae@gmail.com", password:"0650f5923e2abce41721d3d9ab37cc54", details:'"sex" => "F"',created_at: new Date()}
    ],{});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
	
	return queryInterface.bulkDelete('users',
    {
      email: [
        "erika@gmail.com", 
        "mae@gmail.com"
      ]
    });
  }
};
