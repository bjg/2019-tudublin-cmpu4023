const Sequelize = require('sequelize');
const dbObj = require('../database/db');
const db = dbObj.get('db');
const express = require('express');
var app = express();


//for foreign key
const usersObj = require('./users');
const Users = usersObj.get('Users');

//Note that if you are using Sequelize migrations you will need to add the createdAt and updatedAt fields to your migration definition:
/*
                                       Table "public.purchases"
   Column   |           Type           | Collation | Nullable |                Default
------------+--------------------------+-----------+----------+---------------------------------------
 id         | integer                  |           | not null | nextval('purchases_id_seq'::regclass)
 created_at | timestamp with time zone |           |          |
 name       | character varying(255)   |           |          |
 address    | character varying(255)   |           |          |
 state      | character varying(2)     |           |          |
 zipcode    | integer                  |           |          |
 user_id    | integer                  |           |          |
Indexes:
    "purchases_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "purchases_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
Referenced by:
    TABLE "purchase_items" CONSTRAINT "purchase_items_purchase_id_fkey" FOREIGN KEY (purchase_id) REFERENCES purchases(id)
*/

const Purchases = db.define('purchases', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
    state: {
        type: Sequelize.STRING
    },
    zipcode: {
        type: Sequelize.INTEGER
    },
    user_id: {
        type: Sequelize.INTEGER,
        references: {
            // This is a reference to another model
            model: Users,
       
            // This is the column name of the referenced model
            key: 'id',
       
            // This declares when to check the foreign key constraint. PostgreSQL only.
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
          }
    },

});

app.set('Purchases', Purchases);
module.exports = app;
