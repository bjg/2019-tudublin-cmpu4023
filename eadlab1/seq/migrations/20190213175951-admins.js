'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable(
                'admin', {
                    createdAt: Sequelize.DATE,
                    updatedAt: Sequelize.DATE,
                    id: {
                        type: Sequelize.INTEGER,
                        primaryKey: true,
                        autoIncrement: true
                    },
                    name: {
                        type: Sequelize.STRING,
                        allowNull: false
                    },
                    password: {
                        type: Sequelize.STRING,
                        allowNull: false
                    },
                    email: Sequelize.STRING
                })
            .then(() => queryInterface.createTable(
                'adminRemoved', {
                    createdAt: Sequelize.DATE,
                    updatedAt: Sequelize.DATE,
                    expires_at: Sequelize.DATE,
                    id: {
                        type: Sequelize.INTEGER,
                        primaryKey: true,
                        autoIncrement: true
                    },
                    value: {
                        type: Sequelize.STRING,
                        allowNull: false
                    },
                    has_been_used: {
                        type: Sequelize.BOOLEAN,
                        allowNull: false
                    },
                    memberId: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'admin',
                            key: 'id'
                        },
                        onUpdate: 'cascade',
                        onDelete: 'cascade'
                    }
                }
            ));
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('adminRemoved')
            .then(() => queryInterface.dropTable('admin'));
    }
};