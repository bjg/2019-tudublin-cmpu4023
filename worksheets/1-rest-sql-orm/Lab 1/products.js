'use strict';
module.exports = function(sequelize, DataTypes){
    var products = sequelize.define('products',{
        title: DataTypes.STRING,
        price:DataTypes.INTEGER,
        createdAt: {
            type: DataTypes.DATE,
            field: "created_at"
        },
        deletedAt:{
            type DataTypes.DATE,
            field: "deleted_at"
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        }
    }, {
        timestamps: false
    }, {
        classMethods: {
            associate: function(models){
            }
        }
    });
    return products;
};