'use strict';
module.exports = function(sequelize, DataTypes) {
  var purchase = sequelize.define('purchase', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
  }, {
      paranoid: false,
      updatedAt: false,
      underscored: true
  },{
    classMethods: {
      associate: function(models) {
        purchase.belongsTo(models.user);
        purchase.hasMany(models.purchase_item);
      }
    }
  });
  return purchase;
};
