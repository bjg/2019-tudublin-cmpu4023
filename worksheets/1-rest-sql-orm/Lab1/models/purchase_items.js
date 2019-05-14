'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchase_items = sequelize.define('purchase_items', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
      },
      price:{
          type: DataTypes.INTEGER,
      },
      quantity:{
          type: DataTypes.INTEGER,
      },
      state:{
          type: DataTypes.STRING
      }
  }, {});
  purchase_items.associate = function(models) {
    // associations can be defined here
  };
  return purchase_items;
};