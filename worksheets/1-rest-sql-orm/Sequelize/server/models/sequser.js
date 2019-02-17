'use strict';
module.exports = (sequelize, DataTypes) => {
  const seqUser = sequelize.define('seqUser', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.JSON,
    created_at:DataTypes.DATE,
    deleted_at:DataTypes.DATE
  }, {});
  seqUser.associate = function(models) {
      seqUser.hasMany(models.seqPurchase,);
  };
  return seqUser;
};