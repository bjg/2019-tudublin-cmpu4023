'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const purchaseList = [
{
	created_at: new Date(),
	name: 'John',
	address: 'Doe',
	state: 'TX',
	zipcode: 123,
	user_id: 1
},
{
	created_at: new Date(),
	name: 'Matilda',
	address: 'Queens',
	state: 'NY',
	zipcode: 456,
	user_id: 10
}];
var del = [];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('purchases',purchaseList, {});
  },

  down: (queryInterface, Sequelize) => {
	for (var i = 0; i < purchaseList.length; i++){
		del.push(String(purchaseList[i].name))
	}
	//console.log(del)
    return queryInterface.bulkDelete('purchases', {name: {[Op.in]: del}}, {})
  }
};

