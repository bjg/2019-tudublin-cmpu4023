'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('purchase_items', [{
            purchase_id: "1234",
            product_id:"21",
            price:"10.99",
            quantity:"2",
            state:"On Route",
            createdAt: new Date(),
            updatedAt: new Date()},
        ],{});
    },

    down: (queryInterface, Sequelize) => {

        return queryInterface.bulkDelete('purchase_items',
            {
                purchase_id:[
                    "1234",
                    "1235",
                ]
            })
    }
};
