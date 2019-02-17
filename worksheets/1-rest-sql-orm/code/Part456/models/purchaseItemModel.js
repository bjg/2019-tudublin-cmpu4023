module.exports = (sequelize, Sequelize) => {
    
    const Purchase = require('./purchaseModel.js')(sequelize, Sequelize); 
    const Product = require('./productModel.js')(sequelize, Sequelize);
    
    const PurchaseItem = sequelize.define('purchase_items', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        price: Sequelize.DECIMAL(10, 2),
        quantity: Sequelize.INTEGER,
        state: Sequelize.STRING
    });
    
    PurchaseItem.belongsTo(Purchase, {foreignKey: 'purchase_id'});
    PurchaseItem.belongsTo(Product, {foreignKey: 'product_id'});
    
    return PurchaseItem;
}
