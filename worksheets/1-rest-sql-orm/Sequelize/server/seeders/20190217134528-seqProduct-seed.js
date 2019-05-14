'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('seqProducts', [
            {
                title: 'Dictionary',
                price: 9.99,
                tags: ["Book"],
            },
            {
                title: 'Python Book',
                price: 29.99,
                tags: ["Book", "Programming", "Python"],
            },
            {
                title: 'Ruby Book',
                price: 27.99,
                tags: ["Book", "Programming", "Ruby"],
            },
            {
                title: 'Baby Book',
                price: 7.99,
                tags: ["Book", "Programming", "Baby Book"],
            },
            {
                title: 'Coloring Book',
                price: 5.99,
                tags: ["Book", "Programming", "Coloring Book"],
            }
        ], {});

    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('seqProduct', null, {});
    }
};
