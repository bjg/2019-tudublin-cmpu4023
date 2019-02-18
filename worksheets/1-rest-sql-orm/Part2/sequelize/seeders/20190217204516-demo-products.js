'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Products', [{
            id: 101,
            title: "The New Product",
            price: 13.99,
            tags: ["Movie"],
            createdAt: new Date(),
            deletedAt: new Date(),
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Products',
            {
                email: [
                    "hello@email.com",
                    "tttt@email.com",
                    "abc@email.com"
                ]
            });
    }
}

