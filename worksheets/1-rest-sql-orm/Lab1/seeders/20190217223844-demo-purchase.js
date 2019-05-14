'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('purchases', [{
            id: 1,
            name: "Bob",
            address: "12 Street Dublin",
            state: 'FL',
            zipcode: '5555',
            createdAt: new Date()
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('purchases', null, {});
    }
};