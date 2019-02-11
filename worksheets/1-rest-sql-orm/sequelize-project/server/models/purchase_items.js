'use strict';
module.exports = function(sequelize, DataTypes) {
  var purchase_items = sequelize.define('purchase_items', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    price: DataTypes.DECIMAL,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {
    /* classMethods: {
      associate: function(models) {
        //purchase_items.belongsTo(models.purchases, {foreignKey: 'fk_purchase', targetKey: 'purchase_id'});
        //purchase_items.belongsTo(models.products, {foreignKey: 'fk_product', targetKey: 'product_id'});
      }
    },
    */
    timestamps: false
  });

  purchase_items.associate = models => {
    purchase_items.hasOne(models.products);
  }

  return purchase_items;
};