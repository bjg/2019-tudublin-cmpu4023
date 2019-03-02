const Sequelize = require('sequelize');
const dbObj = require('../database/db');
const db = dbObj.get('db');
const express = require('express');
var app = express();

//Note that if you are using Sequelize migrations you will need to add the createdAt and updatedAt fields to your migration definition:

/*
                                      Table "public.products"
   Column   |           Type           | Collation | Nullable |               Default
------------+--------------------------+-----------+----------+--------------------------------------
 id         | integer                  |           | not null | nextval('products_id_seq'::regclass)
 title      | character varying(255)   |           |          |
 price      | numeric                  |           |          |
 created_at | timestamp with time zone |           |          |
 deleted_at | timestamp with time zone |           |          |
 tags       | character varying(255)[] |           |          |

*/
const Products = db.define('products', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.NUMERIC
    },
    tags: {
        type: Sequelize.HSTORE
    }
});

app.set('Products', Products);
module.exports = app;
