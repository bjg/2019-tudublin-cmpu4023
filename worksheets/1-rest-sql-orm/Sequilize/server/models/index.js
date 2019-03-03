'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//Models/tables for easier relationship modelling
db.products = require('../models/products')(sequelize, Sequelize);
db.purchase_items = require('../models/purchase_items')(sequelize, Sequelize);
db.purchases = require('../models/purchases')(sequelize, Sequelize);
db.users = require('../models/users')(sequelize, Sequelize);

//The associations
//between products and purchase_items
db.purchase_items.belongsTo(db.products);
db.products.hasMany(db.purchase_items);
//between purchse_items and purchases
db.purchase_items.belongsTo(db.purchases);
db.purchases.hasMany(db.purchase_items);
//between users and purchases
db.purchases.belongsTo(db.users);
db.users.hasMany(db.purchases);

module.exports = db;