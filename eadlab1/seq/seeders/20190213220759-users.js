'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('users', [{
            email: 'Jjogn@gmail.com',
            password: 'fjdsal',
            details: '"sex"=>"M"',
            created_at: '2010-11-20 10:58:00+00',
            deleted_at: null
        }, {
            email: 'June@gmail.com',
            password: 'jvjwkwk',
            details: '"sex"=>"F"',
            created_at: '2015-11-20 10:58:00+00',
            deleted_at: null
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', null, {});
    }
};