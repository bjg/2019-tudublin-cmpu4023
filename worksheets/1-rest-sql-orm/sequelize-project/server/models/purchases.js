'use strict';
module.exports = function(sequelize, DataTypes) {
  var purchases = sequelize.define('purchases', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    timestamps: false
  });

  purchases.associate = models => {
    // Set an association between the purchases table and the user_id table
    purchases.belongsTo(models.users, {
      foreignKey: 'user_id',
    });

    purchases.hasMany(models.purchase_items, {
      foreignKey: 'purchase_id',
    });
  }

  return purchases;
};