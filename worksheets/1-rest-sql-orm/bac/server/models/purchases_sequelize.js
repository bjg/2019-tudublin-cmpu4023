'use strict';
module.exports = (sequelize, DataTypes) => {
  const Purchases_Sequelize = sequelize.define('Purchases_Sequelize', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    users_SequelizeID: DataTypes.INTEGER
  }, {});
  Purchases_Sequelize.associate = function(models) {
    // associations can be defined here
    Purchases_Sequelize.hasMany(models.PurchaseItems_Sequelize)
    Purchases_Sequelize.belongsTo(models.Users_Sequelize)
  };
  return Purchases_Sequelize;
};