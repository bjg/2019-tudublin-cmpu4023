'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('admin', [{
            name: 'John',
            password: 'hello',
            email: 'admin@admin.com'
        }, {
            name: 'JDaveohn',
            password: 'howyou',
            email: 'dave@gmail.com'
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('admin', null, {});
    }
};