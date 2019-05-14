'use strict';
module.exports = (sequelize, DataTypes) => {
  const seqPurchase = sequelize.define('seqPurchase', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    created_at:DataTypes.DATE,
    seqUserId:DataTypes.INTEGER
  }, {});
  seqPurchase.associate = function(models) {
    seqPurchase.hasMany(models.seqPurchase_Item,);
    seqPurchase.belongsTo(models.seqUser);
  };
  return seqPurchase;
};