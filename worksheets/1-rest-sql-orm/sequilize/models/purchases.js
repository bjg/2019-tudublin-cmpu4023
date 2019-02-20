'use strict';
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('purchases', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: {
      type: DataTypes.DATE
    },
    name: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.STRING
    },
    zipcode: {
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
	  field:"user_id",
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'purchases',
    timestamps: false
  });

   purchases.associate = function(models) {
    // associations can be defined here
  };
  return purchases;
}; 