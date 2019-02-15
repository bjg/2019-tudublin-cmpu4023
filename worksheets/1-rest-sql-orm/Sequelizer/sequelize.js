const Sequelize = require('sequelize')
const UserModel = require('./models/user')
const PurchaseModel = require('./models/purchase')
const ProductModel = require('./models/product')
const PurchaseItemModel = require('./models/purchase_item')

const sequelize = new Sequelize('pgguide', 'Max', 'Audioslave1!', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: false
  }
})

const User = UserModel(sequelize, Sequelize)
const Purchase = PurchaseModel(sequelize, Sequelize)
const Product = ProductModel(sequelize, Sequelize)
const PurchaseItem = PurchaseItemModel(sequelize, Sequelize)

User.hasMany(Purchase, {foreignKey: 'user_id'});
Purchase.hasMany(PurchaseItem, {foreignKey: 'purchase_id'});
Product.hasMany(PurchaseItem, {foreignKey: 'product_id'});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});

// Sync modal to database
// sequelize.sync({ alter: true })
  // .then(() => {
    // console.log(`Database & models synced`)
// })
  
// Show can retrieve data
// Purchase.findAll().then(function(purchase) {
  // console.log(purchase)
// })

// Add new test data for each model
// User.build({ email: 'johndoe@gmail.com', password: 'foo', created_at: new Date()})
  // .save()
  // .catch(function(error) {console.log(error)
// })

// Product.build({ title: 'Lords Loss', price: 19.99, created_at: new Date()})
  // .save()
  // .catch(function(error) {console.log(error)
// })

// Purchase.build({ name: 'Kevin Doran', address: 'foo', created_at: new Date(),
  // state: 'PA', zipcode: '20456', user_id: 1})
  // .save()
  // .catch(function(error) {console.log(error)
// })

// PurchaseItem.build({ price: 9.99, quantity: 1, state: 'Pending',
  // purchase_id: 1, product_id: 1})
  // .save()
  // .catch(function(error) {console.log(error)
// })

module.exports = {
  User,
  Purchase,
  Product,
  PurchaseItem
}