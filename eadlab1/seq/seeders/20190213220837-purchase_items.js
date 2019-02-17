'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('purchase_items', [{
            price: '78.21',
            quantity: '1',
            state: 'Delivered'
        }, {
            price: '85.11',
            quantity: '1',
            state: 'Delivered'

        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('purchase_items', null, {});
    }
};