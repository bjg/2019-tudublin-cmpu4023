'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const userList = [
{
	email: 'testuser@dit.ie',
	password: '1234',
	details: '"sex"=>"F","state"=>"Florida"',
	created_at: new Date()
},
{
	email: 'johnmalkovich@gmail.com',
    password: 'password',
    details: '"sex"=>"M","state"=>"Wyoming"',
	created_at: new Date()
}];
var del = [];

'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', 	userList, {});
  },

  down: (queryInterface, Sequelize) => {
	for (var i = 0; i < userList.length; i++){
		del.push(String(userList[i].email))
	}
    return queryInterface.bulkDelete('users', {email: {[Op.in]: del}}, {})
  }
};

