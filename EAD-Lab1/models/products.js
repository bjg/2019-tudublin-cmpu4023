'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    id: {type: Sequelize.INTEGER, primaryKey: true,allowNull:false, autoIncrement: true},	
    title:{type: Sequelize:STRING}, 
    tags: {type.HSTORE}
  });
  products.associate = function(models) {
    // associations can be defined here
  };
  return products;
};