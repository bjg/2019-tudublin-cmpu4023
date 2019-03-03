'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchase_items = sequelize.define('purchase_items', {
    id: {type: DataTypes.INTEGER,
         primaryKey: true },
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {timestamps: false});
  purchase_items.associate = function(models) {
    purchase_items.belongsTo(models.users);
    purchase_items.belongsTo(models.purchases);
  };
  return purchase_items;
};
