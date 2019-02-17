'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchases = sequelize.define('purchases', {
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		unique: true
	},
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER
    //user_id: DataTypes.INTEGER
  }, {timestamps: false});
  purchases.associate = function(models) {
    // associations can be defined here
  };
  
  purchases.associate = models => {
    purchases.belongsTo(models.users, {
      foreignKey: 'user_id',
    });

    purchases.hasMany(models.purchase_items, {
      foreignKey: 'purchase_id',
    });
  }
  return purchases;
};