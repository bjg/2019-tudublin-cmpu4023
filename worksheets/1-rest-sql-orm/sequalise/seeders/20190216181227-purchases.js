'use strict';
//start at id 1001 to avoid conflicts with sql dump file
module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('purchases', [{
	    id:1001,
		created_at: new Date("2019-02-16"),
        name: 'John Doe',
        address:'John Street',
		state:'FL',
		zipcode:'9999',
		user_id: 52
      },{
	    id:1002,
		created_at: new Date("2019-02-16"),
        name: 'Mary Sue',
        address:'Mary Street',
		state:'FL',
		zipcode:'9999',
		user_id: 53
      }], {});
  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.bulkDelete('purchases', {id: {[Sequelize.Op.in]: [1001, 1002]}}, {});
  }
};
