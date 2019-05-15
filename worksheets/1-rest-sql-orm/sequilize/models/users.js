'use strict';
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    details: {
      type: "HSTORE"
    },
    created_at: {
      type: DataTypes.DATE
    },
    deleted_at: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'users',
    timestamps: false
  });

   users.associate = function(models) {
    // associations can be defined here
  };
  return users;
}; 