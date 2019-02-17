'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Purchases', [{
            name: "Jessica",
            address: "123 Yellow Avn",
            state: "NY",
            zipcode: "12345",
            user_id: "21",
            createdAt: new Date(),
            updatedAt: new Date()
        },], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Purchases', null, {});
    }
};
