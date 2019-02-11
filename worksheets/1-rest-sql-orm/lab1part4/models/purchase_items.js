const Sequelize = require('sequelize');
const dbObj = require('../database/db');
const db = dbObj.get('db');
const express = require('express');
var app = express();

//for the foreign key constraint
const purchasesObj = require('./purchases');
const Purchases = purchasesObj.get('Purchases');

//Note that if you are using Sequelize migrations you will need to add the createdAt and updatedAt fields to your migration definition:

/*
                                      Table "public.purchase_items"
   Column    |          Type          | Collation | Nullable |                  Default
-------------+------------------------+-----------+----------+--------------------------------------------
 id          | integer                |           | not null | nextval('purchase_items_id_seq'::regclass)
 purchase_id | integer                |           |          |
 product_id  | integer                |           |          |
 price       | numeric                |           |          |
 quantity    | integer                |           |          |
 state       | character varying(255) |           |          |
Foreign-key constraints:
    "purchase_items_purchase_id_fkey" FOREIGN KEY (purchase_id) REFERENCES purchases(id)
*/

const Purchase_items = db.define('purchase_items', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    purchase_id: {
        type: Sequelize.INTEGER,
        references: {
            // This is a reference to another model
            model: Purchases,
       
            // This is the column name of the referenced model
            key: 'id',
       
            // This declares when to check the foreign key constraint. PostgreSQL only.
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
          }
    },
    product_id: {
        type: Sequelize.INTEGER,
    },
    price: {
        type: Sequelize.NUMERIC
    },
    quantity: {
        type: Sequelize.INTEGER
    },
    state: {
        type: Sequelize.STRING
    }
   

});

app.set('Purchase_items', Purchase_items);
module.exports = app;
