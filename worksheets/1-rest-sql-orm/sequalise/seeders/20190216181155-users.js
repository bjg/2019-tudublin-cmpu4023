'use strict';
//start at id 51 to avoid conflicts with sql dump file
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('users', [{
	    id:52,
		created_at: new Date("2019-02-16"),
        email: 'JohnDoe@mail.net',
		password: '1234'
      },{
	    id:53,
		created_at: new Date("2019-02-16"),
        email: 'MarySue@mail.net',
		password: '1234'
      },{
	    id:54,
		created_at: new Date("2019-02-16"),
        email: 'GIJoe@mail.net',
		password: '1234'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('users', {id: {[Sequelize.Op.in]: [52, 53, 54]}}, {});
  }
};
