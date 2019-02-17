'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchases = sequelize.define('purchases', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER
  }, {
    paranoid: true,
    updatedAt: false,
    underscored: true
  });
  purchases.associate = function (models) {

    purchases.belongsTo(models.users);

    purchases.hasMany(models.purchase_items);
  };
  return purchases;
};