'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('purchases', [{
            created_at: '2011-03-16 15:03:00+00',
            name: 'Steve',
            address: '312 MLK Ave',
            state: 'FL',
            zipcode: '50375',
        }, {
            created_at: '2015-03-16 15:03:00+00',
            name: 'John',
            address: '311 MLK Ave',
            state: 'FL',
            zipcode: '50421',
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('purchases', null, {});
    }
};