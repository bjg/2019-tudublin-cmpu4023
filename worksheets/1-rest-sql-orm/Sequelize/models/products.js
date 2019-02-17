module.exports = (sequelize, DataTypes) => {
    const Products = sequelize.define('products', {
        title: DataTypes.STRING,
        price: DataTypes.INTEGER
    }, {
        timestamps: false
    });
    Products.associate = function(models) {
        // associations can be defined here
    };
    return Products;
};