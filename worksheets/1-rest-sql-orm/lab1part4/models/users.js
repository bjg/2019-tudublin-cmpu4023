const Sequelize = require('sequelize');
const dbObj = require('../database/db');
const db = dbObj.get('db');
const express = require('express');
var app = express();
/*
id         | integer                  |           | not null | nextval('users_id_seq'::regclass)
 email      | character varying(255)   |           |          |
 password   | character varying(255)   |           |          |
 details    | hstore                   |           |          |
 created_at | timestamp with time zone |           |          |
 deleted_at | timestamp with time zone |           |          |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
Referenced by:
    TABLE "purchases" CONSTRAINT "purchases_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
*/
const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    details: {
        type: Sequelize.HSTORE
    }
});

app.set('Users', User);
module.exports = app;
