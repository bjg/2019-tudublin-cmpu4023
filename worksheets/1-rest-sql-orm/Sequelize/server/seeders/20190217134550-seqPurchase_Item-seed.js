'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('seqPurchase_Items', [
            {
                seqPurchasesId: 1,
                seqProductId: 1,
                price: 27.99,
                quantity: 1,
                state: 'Delivered'
            },
            {
                seqPurchasesId: 1,
                seqProductId: 5,
                price: 5.99,
                quantity: 1,
                state: 'Returned'
            },
            {
                seqPurchasesId: 2,
                seqProductId: 1,
                price: 9.99,
                quantity: 2,
                state: 'Delivered'
            },
            {
                seqPurchasesId: 3,
                seqProductId: 4,
                price: 7.99,
                quantity: 1,
                state: 'Pending'
            },
            {
                seqPurchasesId: 4,
                seqProductId: 4,
                price: 7.99,
                quantity: 3,
                state: 'Delivered'
            },

        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('seqPurchase_Items', null, {});
    }
};
