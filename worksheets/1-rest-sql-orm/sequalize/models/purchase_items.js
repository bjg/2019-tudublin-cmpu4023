'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchase_items = sequelize.define('purchase_items', {
    purchase_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {
    paranoid: true,
    updatedAt: false,
    underscored: true
  });
  purchase_items.associate = function (models) {
    // associations can be defined here
    purchase_items.belongsTo(models.purchases, {
      foreignKey: 'purchase_id'
    });
    purchase_items.belongsTo(models.products, {
      foreignKey: 'product_id'
    });
  };
  return purchase_items;
};