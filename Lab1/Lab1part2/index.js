const Sequelize = require('sequelize');

const sequelize = new Sequelize('pgguide', 'Thomas', 'cronin98', {
    host: 'localhost',
    dialect: 'postgres'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  
  sequelize.sync({force: false}).then(() => {
  console.log('Successfully synced to DB');
});

var User = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id', 
	primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING,
	field: 'email'
  },
  password: {
    type: Sequelize.STRING,
	field: 'password'
  },
  details: {
    type: Sequelize.STRING,
	field: 'details'
  },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
	field: 'created_at'
  },
  deletedAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
	field: 'deleted_at'
  }
}, {
  timestamps: false,
  freezeTableName: true 
});

/*
User.sync({force: false}).then(function () {
  // Table created
  return User.create({
    email: 'John',
    password: 'Hanock',
	details: 'M'
  });
});
*/

var Purchase = sequelize.define('purchases', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
	primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING,
	field: 'address'
  },
  state: {
    type: Sequelize.STRING,
	field: 'state'
  },
  zipcode: {
    type: Sequelize.INTEGER,
	field: 'zipcode'
  },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
	field: 'created_at'
  },
  userId: {
    type: Sequelize.INTEGER,
	field: 'user_id'
  }
}, {
  timestamps: false,
  freezeTableName: true 
});

User.hasMany(Purchase);

var Product = sequelize.define('products', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
	primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING,
	field: 'title'
  },
  price: {
    type: Sequelize.INTEGER,
	field: 'price'
  },
  tags: {
    type: Sequelize.STRING,
	field: 'tags'
  },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
	field: 'created_at'
  },
  deletedAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
	field: 'deleted_at'
    }
}, {
  timestamps: false,
  freezeTableName: true 
});

var PurchaseItem = sequelize.define('purchase_items', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
	primaryKey: true,
    autoIncrement: true
  },
  purchaseId: {
    type: Sequelize.INTEGER,
	field: 'purchase_id'
  },
  productId: {
    type: Sequelize.INTEGER,
	field: 'product_id'
  },
  price: {
    type: Sequelize.INTEGER,
	field: 'price'
  },
  quantity: {
    type: Sequelize.INTEGER,
	field: 'quantity'
  },
  state: {
    type: Sequelize.STRING,
	field: 'state'
  }
}, {
  timestamps: false,
  freezeTableName: true
});

Purchase.hasMany(PurchaseItem)
Product.hasMany(PurchaseItem)

/*
User.findAll().then(users => {
  console.log(users)
})
*/
/*
PurchaseItem.findAll().then(purchases => {
  console.log(purchases)
})
*/

//Part 6, used to insert more data into the model Product
/*
Product.bulkCreate([
  { title: 'NewProduct1', price: 9.00, tags: '{Great}' },
  { title: 'NewProduct2', price: 10.00, tags: '{Terrible}' }
]).then(function() {
  return Product.findAll();
}).then(function(products) {
  console.log(products) 
})
*/

//Part 6, used to insert more data into the model User
/*
User.bulkCreate([
  { email: "NewUser1@gmail.com", password: "pass1", details: "\"sex\"=>\"M\"" },
  { email: "NewUser2@gmail.com", password: "pass2", details: "\"sex\"=>\"F\"" }
]).then(function() {
  return User.findAll();
}).then(function(users) {
  console.log(users) 
})
*/

//"id":22,"title":"NewProduct1","price":"9","created_at":"2019-03-02T14:49:17.930Z","deleted_at":"2019-03-02T14:49:17.930Z","tags":["Great"]},
//"id":23,"title":"NewProduct2","price":"10","created_at":"2019-03-02T14:49:17.930Z","deleted_at":"2019-03-02T14:49:17.930Z","tags":["Terrible"]},
//[{"id":51,"email":"NewUser1@gmail.com","details":"\"sex\"=>\"M\""}]
//[{"id":52,"email":"NewUser2@gmail.com","details":"\"sex\"=>\"F\""}]

//Part 6, used to insert more data into the model Purchase
/*
Purchase.bulkCreate([
  { name: "New User1", address: "New road1", state: "Ne", zipcode: 2898 },
  { name: "New User2", address: "New road2", state: "Nw", zipcode: 2396 }
]).then(function() {
  return Purchase.findAll();
}).then(function(purchases) {
  console.log(purchases) 
})
*/

const express = require('express');
const http = require('http');
const massive = require('massive');

const app = express();

//Used to get a products deatils by name
app.get('/product/:name', function(req, res, next) {
    Product.findOne({
  where: {
    title: req.params.name
  }
}).then(products => {
  res.json(products);
})
});

//Used to show details of a specific product
app.get('/products/:id', function(req, res, next) {
    Product.findOne({
  where: {
    id: req.params.id
  }
}).then(products => {
  res.json(products);
})
});

/*
app.get('/purchase/:id', function(req, res, next) {
    PurchaseItem.findOne({
  where: {
    productId: req.params.id
  }
}).then(purchase_items => {
  res.json(purchase_items);
})
});
*/

//Used to update a product. Enter the products key that you want to update and new name in the :name parameter
app.get('/update/products/:id/:name', function(req, res) {
  Product.findOne({
    where: {
    id: req.params.id
  }
  }).then(function(Product){
	if(Product){
		Product.updateAttributes({
			title: req.params.name
		}).then(function(Product){
			res.send(Product);
		});
	}
  });
});

//I couldnt do the delete as i would have to delete all the reocrds in the purchase items table relating to the product i deleted from the product table
/*
app.get('/delete/products/:id', function(req, res) {
sequelize.query('SELECT * FROM products where id = ' + req.params.id, 
{ model: Product }).then(products => {
  res.json(products);
})

sequelize.query('SELECT * FROM purchase_items where product_id = ' + req.params.id, 
{ model: PurchaseItem }).then(purchase_items => {
  res.json(purchase_items);
})
});
*/

//Used to create a new product
app.get('/post/products/:title/:price/:tags', function(req, res) {
sequelize.query("INSERT INTO products (title, price, tags) VALUES ("+"'"+req.params.title+"'"+", "+"'"+req.params.price+"'" + ", "+"'"+req.params.tags+"'"+ ");", 
{ model: Product }).then(products => {
  res.json(products);
})
});



http.createServer(app).listen(3000);
