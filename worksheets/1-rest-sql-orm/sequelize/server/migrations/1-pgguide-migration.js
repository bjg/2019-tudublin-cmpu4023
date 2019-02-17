'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "products", deps: []
 * createTable "users", deps: []
 * createTable "purchases", deps: [users]
 * createTable "purchase_items", deps: [purchases, products]
 *
 **/

var info = {
    "revision": 1,
    "name": "test-migration",
    "created": "2019-02-17T15:02:06.774Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "products",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "title": {
                    "type": Sequelize.STRING,
                    "field": "title",
                    "allowNull": true
                },
                "price": {
                    "type": Sequelize.DOUBLE PRECISION,
                    "field": "price",
                    "allowNull": true
                },
                "created_at": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": true
                },
                "deleted_at": {
                    "type": Sequelize.DATE,
                    "field": "deleted_at",
                    "allowNull": true
                },
                "tags": {
                    "type": Sequelize.undefined,
                    "field": "tags",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "users",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "email": {
                    "type": Sequelize.STRING,
                    "field": "email",
                    "allowNull": true
                },
                "password": {
                    "type": Sequelize.STRING,
                    "field": "password",
                    "allowNull": true
                },
                "details": {
                    "type": Sequelize.undefined,
                    "field": "details",
                    "allowNull": true
                },
                "created_at": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": true
                },
                "deleted_at": {
                    "type": Sequelize.DATE,
                    "field": "deleted_at",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "purchases",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "created_at": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": true
                },
                "name": {
                    "type": Sequelize.STRING,
                    "field": "name",
                    "allowNull": true
                },
                "address": {
                    "type": Sequelize.STRING,
                    "field": "address",
                    "allowNull": true
                },
                "state": {
                    "type": Sequelize.STRING,
                    "field": "state",
                    "allowNull": true
                },
                "zipcode": {
                    "type": Sequelize.INTEGER,
                    "field": "zipcode",
                    "allowNull": true
                },
                "user_id": {
                    "type": Sequelize.INTEGER,
                    "field": "user_id",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "purchase_items",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "purchase_id": {
                    "type": Sequelize.INTEGER,
                    "field": "purchase_id",
                    "references": {
                        "model": "purchases",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "product_id": {
                    "type": Sequelize.INTEGER,
                    "field": "product_id",
                    "references": {
                        "model": "products",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "price": {
                    "type": Sequelize.DOUBLE PRECISION,
                    "field": "price",
                    "allowNull": true
                },
                "quantity": {
                    "type": Sequelize.INTEGER,
                    "field": "quantity",
                    "allowNull": true
                },
                "state": {
                    "type": Sequelize.STRING,
                    "field": "state",
                    "allowNull": true
                }
            },
            {}
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
