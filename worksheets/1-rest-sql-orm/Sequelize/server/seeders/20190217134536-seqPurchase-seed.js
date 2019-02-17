'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('seqPurchases', [
            {
                name: 'Earlean Bonacci  ',
                address: '6425 43rd St.  ',
                state: 'FL',
                zipcode: 50382,
                seqUserId: 1
            },
            {
                name: 'Evelyn Patnode',
                address: '321 MLK Ave.',
                state: 'WA',
                zipcode: 43895,
                seqUserId: 2
            },
            {
                name: 'Derek Crenshaw',
                address: '2307 45th St.',
                state: 'Ga',
                zipcode: 98937,
                seqUserId: 3
            },
            {
                name: 'Shari Julian',
                address: '7046 10th Ave. ',
                state: 'NY',
                zipcode: 57243,
                seqUserId: 4
            },
            {
                name: 'Evelyn Patnode',
                address: '321 MLK Ave.',
                state: 'WA',
                zipcode: 43895,
                seqUserId: 2
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {

        return queryInterface.bulkDelete('seqPurchases', null, {});

    }
};
