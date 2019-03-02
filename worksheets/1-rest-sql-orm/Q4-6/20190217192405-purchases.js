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
	
	return queryInterface.bulkInsert('purchases',
    [
      //created_at: ,name: , address:, state: , zipcode: ,user_id:
      {created_at: new Date(),name:"Erika Mae", address: "819 The falls", state:"IL", zipcode:"1234", user_id:"100"},
      {created_at: new Date(),name:"Iwo Maciej", address: "23 Flower Lane", state:"TX", zipcode:"5678", user_id:"101"}
    ],{});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
	
	/*return queryInterface.bulkDelete('purchases',
    [
      {name:"Erika Mae", address: "819 The falls", state:"IL", zipcode:"1234", user_id:"100"},
      {name:"Iwo Maciej", address: "23 Flower Lane", state:"TX", zipcode:"5678", user_id:"101"}
    ],{});*/
  }
};
