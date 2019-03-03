'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchase_items = sequelize.define('purchase_items', {
    id:{type: Sequelize.INTEGER, allowNull: false, autoIncrement:true},
	
    purchase_id:{type: Sequelize.INTEGER,
	references: { model:purchases, key:'id',}},
	
    product_id: {type: Sequelize.INTEGER,},
	
	price: {type: Sequelize.NUMERIC},
	
    quantity: {type:Sequelize.INTEGER}, 
	
    state: {type:Sequelize.STRING}
  });
  purchase_items.associate = function(models) {
    // associations can be defined here
  };
  return purchase_items;
};