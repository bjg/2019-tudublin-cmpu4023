'use strict';
module.exports = (sequelize, DataTypes) => {
  const PurchaseItems_Sequelize = sequelize.define('PurchaseItems_Sequelize', {
    purchases_sequelizeID: DataTypes.INTEGER,
    products_sequelizeID: DataTypes.INTEGER,
    price: DataTypes.NUMERIC,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {});
  PurchaseItems_Sequelize.associate = function(models) {
    // associations can be defined here
    PurchaseItems_Sequelize.belongsTo(models.Products_Sequelize);
    PurchaseItems_Sequelize.belongsTo(models.Purchases_Sequelize);
  };
  return PurchaseItems_Sequelize;
};