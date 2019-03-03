'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('adminRemoved', [{
            value: 'Not Active',
            has_been_used: 'Yes'
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('adminRemoved', null, {});
    }
};