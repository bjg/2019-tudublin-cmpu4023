'use strict';
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('users', {
    email: DataTypes.STRING,
    password: DataTypes.STRING, 
    details: {
      type: DataTypes.JSON(DataTypes.STRING)
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at"
    }, 
    deletedAt: {
      type: DataTypes.DATE,
      field: "deleted_at"
    }
  }, {
    timestamps: false
  }, {
    classMethods: {
      associate: function(models) {
        //users.hasMany(models.purchases);
      }
    }
  });
  return users;
};

