'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchaset = sequelize.define('purchaset', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {});
  purchaset.associate = function(models) {
    // associations can be defined here
    purchaset.belongsTo(models.userst);
    purchaset.hasMany(models.purchase_itemst);
  };
  return purchaset;
};