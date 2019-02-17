const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'pgguide',
    'postgres',
    '1234566',
    {
        dialect: 'postgres',
    },
)

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        //If successful then populate with some data (part 5)
        require('./populate')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });



const models = {
    Product: sequelize.import('./models/product'),
    PurchaseItems: sequelize.import('./models/purchase_items'),
    Users: sequelize.import('./models/users'),
    Purchases: sequelize.import('./models/purchases')
};

module.exports = {
    models,
    sequelize
}