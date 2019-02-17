'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
	return Promise.all([
		queryInterface.renameColumn('products','title','name')
	]);
  },

  down: (queryInterface, Sequelize) => {
	return Promise.all([
		queryInterface.renameColumn('products','name','title')
	]);
  }
};
