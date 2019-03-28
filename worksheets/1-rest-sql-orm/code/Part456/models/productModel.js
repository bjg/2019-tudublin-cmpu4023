module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('products', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        title: Sequelize.STRING,
        price: Sequelize.DECIMAL(10, 2),
        tags: Sequelize.ARRAY( Sequelize.STRING )
    },{
        timestamps: true,
        createdAt: 'created_at',
        deletedAt: 'deleted_at',
        updatedAt: false,
        paranoid: true
    });
    
    return Product;
}
