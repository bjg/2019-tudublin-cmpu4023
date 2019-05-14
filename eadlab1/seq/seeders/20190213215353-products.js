'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('products', [{
            title: 'code',
            price: '8.99',
            created_at: '2011-01-01 20:00:00+00',
            deleted_at: null,
            tags: '{Book}'

        }, {
            title: 'java',
            price: '10.99',
            created_at: '2019-03-13 20:00:00+00',
            deleted_at: null,
            tags: '{DVD}',
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('products', null, {});
    }
};