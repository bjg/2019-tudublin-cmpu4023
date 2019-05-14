'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchase = sequelize.define('purchase', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER
  }, {
    underscored: true
  });
  purchase.associate = function(models) {
    // Purchase belongs to a user
    purchase.belongsTo(models.user);
    purchase.hasMany(models.purchase_item);
  };
  return purchase;
};