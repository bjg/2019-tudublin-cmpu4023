'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('seqUsers', [
            {
                email: 'Earlean.Bonacci@yahoo.com',
                password: '029761dd44fec0b14825843ad0dfface',
                details:   '{"sex":"M"}',
            },
            {
                email: 'Evelyn.Patnode@gmail.com  ',
                password: 'd678656644a3f44023f90e4f1cace1f4',
                details: '{}',
            },
            {
                email: 'Derek.Crenshaw@gmail.com ',
                password: '9d38df22b71c8896137d363edsaasd29814e5f',
                details:'{  "sex":"M" }'
            },
            {
                email: 'Shari.Julian@yahoo.com',
                password: '9d38df22b71c8896137d363e29814e5f ',
                details: '{ "sex":"F"}'
            },
            {
                email: 'Quinton.Gilpatrick@yahoo.com',
                password: '100945c1684d6926dcafcacd967aedd9',
                details: '{"sex":"M","State": "South Carolina"}'
            }

        ], {});

    },

    down: (queryInterface, Sequelize) => {

        return queryInterface.bulkDelete('seqUsers', null, {});
    }
};
