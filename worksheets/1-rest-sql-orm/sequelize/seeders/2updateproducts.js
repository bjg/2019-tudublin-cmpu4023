'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const productList = [
{
	title: 'test',
	price: 10.5,
	created_at: new Date(),
	tags: ['test']
},
{
	title: 'free',
	price: 7.5,
	created_at: new Date(),
	tags: ['test2, test3']
}];
var del = [];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('products',productList, {});
  },

  down: (queryInterface, Sequelize) => {
	for (var i = 0; i < productList.length; i++){
		del.push(String(productList[i].title))
	}
	//console.log(del)
    return queryInterface.bulkDelete('products', {title: {[Op.in]: del}}, {})
  }
};
