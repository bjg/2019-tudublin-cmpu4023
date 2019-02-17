'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('purchase_items', [{
            id: 2,
            purchase_id: 5,
            product_id: 1,
            price: 100,
            quantity: 2,
            state: 'Delivered'
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('purchase_items', null, {});
    }
};