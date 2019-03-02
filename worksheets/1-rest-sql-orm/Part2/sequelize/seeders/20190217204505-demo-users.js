'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [{
            email:"john@email.com",
            details:'"sex" => "M"',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        ],{});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});    }
};

