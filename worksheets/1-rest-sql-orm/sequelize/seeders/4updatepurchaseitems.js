'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const itemList = [
{
	purchase_id: 1,
	product_id: 1,
	price: 14.40,
	quantity: 2,
	state: 'delivered'
},
{
	purchase_id: 2,
	product_id: 4,
	price:440.15,
	quantity: 8,
	state: 'delivered'
}];
var del = [];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('purchase_items',itemList, {});
  },

  down: (queryInterface, Sequelize) => {
	for (var i = 0; i < itemList.length; i++){
		del.push(String(itemList[i].purchase_id))
	}
	//console.log(del)
    return queryInterface.bulkDelete('purchase_items', {purchase_id: {[Op.in]: del}}, {})
  }
};

