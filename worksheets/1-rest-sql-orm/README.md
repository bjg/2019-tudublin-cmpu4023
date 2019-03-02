# Worksheet1

### Q1
I ran it first  by using
```
node index2.js
```

//1.1 List all users email and sex in order of most recently created. Do not include password hash in your output
```
  app.get('/users', async(req, res) => {
	  const users = await req.app.get('db').query('select email,details -> \'sex\' as sex from users ORDER BY created_at DESC;');
	  res.json(users);
  });
  
  http://localhost:3000/users
```
![capture](https://user-images.githubusercontent.com/23324954/52915889-34fc1480-32d1-11e9-954d-aa2a8ec2b1b8.PNG)


//1.2 Show above details of the specified user

```
  app.get('/users/:id', async(req, res) => {
    //const id = req.params.id;
	  const users = await req.app.get('db').query('select email,details -> \'sex\' as sex from users where id = ${id} ORDER BY created_at desc;', {
            id: req.params.id,
        });
    res.json(users);
  });
  
  http://localhost:3000/users/3
```

![capture1](https://user-images.githubusercontent.com/23324954/52915879-244b9e80-32d1-11e9-8db6-f370fdb050f5.PNG)
//1.3 List all products in ascending order of price
```
  app.get('/products',async(req, res) => {
    const result = await req.app.get('db').query("select * from products ORDER BY created_at ASC")
    res.json(result);
  });
  
  http://localhost:3000/products
```

![capture2](https://user-images.githubusercontent.com/23324954/52915880-244b9e80-32d1-11e9-8caa-04e85ef2e09f.PNG)
//1.4 Show details of the specified products
```
  app.get('/products/:id', async(req, res) => {
    const products = await req.app.get('db').products.findOne({ 'id =': req.params.id }).then(products => {
            res.json(products);
        });
  });
  
  http://localhost:3000/products/4
```
![capture3](https://user-images.githubusercontent.com/23324954/52915881-244b9e80-32d1-11e9-92de-96bab6da9133.PNG)
 //1.5 List purchase items to include the receiver’s name and, address, the purchaser’s email address and the price, quantity and delivery status of the purchased item. Order by price in descending order
```
  app.get('/purchases', async(req, res) => {
    const purchases = await req.app.get('db').query('select purchases.name, purchases.address, purchase_items.price, purchase_items.quantity, users.email from purchases INNER JOIN purchase_items ON purchases.id=purchase_items.purchase_id INNER JOIN users ON purchases.user_id=users.id ORDER BY price DESC;');
    res.json(purchases);
  });
  
  http://localhost:3000/purchases
 ```
 ![capture4](https://user-images.githubusercontent.com/23324954/52915882-244b9e80-32d1-11e9-9203-40abe61b153e.PNG)

### Q2
```
  app.get('/productspoor',async(req, res) => {
    //const name = req.query.name;
	  const result = await req.app.get('db').query("select * from products where title='" + req.query.name + "'");
	  res.json(result);
  });
```

```
http://localhost:3000/productspoor?name=Pop CD
```
![capture5](https://user-images.githubusercontent.com/23324954/52915934-cff4ee80-32d1-11e9-8c94-54abfd4280cf.PNG)

We check the file POP CD still exists

![capture6](https://user-images.githubusercontent.com/23324954/52915961-0af72200-32d2-11e9-9ec1-c4bb357b26cf.PNG)

To delete
```
http://localhost:3000/productspoor?name=Pop CD'; DELETE FROM purchase_items WHERE product_id = 14; DELETE FROM products WHERE title = 'Pop CD';
```
POP CD is deleted
![capture7](https://user-images.githubusercontent.com/23324954/52915990-5b6e7f80-32d2-11e9-995c-2e7ff8abde7b.PNG)

### Q3
## Stored Procedure
```
app.get('/productsfix',async(req, res) => {
    const result = await req.app.get('db').query('select * from products where title = ${name}' ,{name : req.query.name});
    res.json(result);
  });
  
 //To delete
 http://localhost:3000/productsfix?name=Pop CD'; DELETE FROM purchase_items WHERE product_id = 14; DELETE FROM products WHERE title = 'Pop CD';

```
## Stored Procedure
```
app.get('/productstored',(req, res) => {
    //const result = await req.app.get('db').get_products(req.query.name);
    //res.json(result);
    app.get('db').get_products(req.query.name).then(product => {
      res.json(product);
      }).catch(error => {console.log("Error")});
  });
  
  
//in get_products.sql
CREATE OR REPLACE FUNCTION get_products(_title text)
    RETURNS SETOF PRODUCTS
    AS $$ 
    	SELECT * FROM products p 
    	WHERE p.title = _title;
    	$$ LANGUAGE SQL STRICT IMMUTABLE;
    	#No delete or update can occur
	
//TO run
http://localhost:3000/productstored?name=Pop CD'; DELETE FROM purchase_items WHERE product_id = 14; DELETE FROM products WHERE title = 'Pop CD';
```

Since there was no change I did not put a screenshot

When attempting to delete there was no change

### Q4

Few set ups were done, no need for screenshots since this is a set up and this website was used to set up
http://docs.sequelizejs.com/manual/tutorial/migrations.html

```
sequelize model:create --name users --attributes "id:Integer,email:string, password:string, details:string"

'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		unique: true
	},
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.STRING
  }, {timestamps: false});
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};

sequelize model:create --name products --attributes "id:Integer,title:string, price:decimal, tags:String"

'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    id: 
	{
		type: DataTypes.INTEGER,
		primaryKey: true,
		unique: true,
		allowNull: false,
		autoIncrement: true
	},
    title: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    tags: DataTypes.ARRAY(DataTypes.STRING),
	created_at: DataTypes.DATE
  }, {timestamps: false}, {
    classMethods: {
      associate: function(models) {
        purchases.belongsTo(models.users, {foreignKey: 'user_id'});
      }
    }
  });
  return products;
};

sequelize model:create --name purchases --attributes "id:Integer,name:string, address:string, state:string, zipcode:integer"

'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchases = sequelize.define('purchases', {
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		unique: true
	},
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER
    //user_id: DataTypes.INTEGER
  }, {timestamps: false});
  return purchases;
};

sequelize model:create --name purchase_items --attributes "id:Integer,purchase_id:Integer,product_id:Integer,price:numeric, quantity:integer, state:string"

'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchase_items = sequelize.define('purchase_items', {
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		unique: true
	},
	purchase_id:DataTypes.INTEGER,
	product_id:DataTypes.INTEGER,
    price: DataTypes.NUMERIC,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {timestamps: false},
	  {
    classMethods: {
      associate: function(models) {
        purchase_items.belongsTo(models.purchases, {foreignKey: 'purchase_id'});
        purchase_items.belongsTo(models.products, {foreignKey: 'product_id'});
      }
    }
  });
  return purchase_items;
};
```

### Q5

I will only give an example for products as it will be the same for the rest of the files

![screenshot 541](https://user-images.githubusercontent.com/23324954/52915696-1c8afa80-32cf-11e9-9c68-07bcb2c8bd43.png)

I would need to generate the seed file, for products I will be using this
```
sequelize seed:generate --name products
```
![screenshot 542](https://user-images.githubusercontent.com/23324954/52915697-1e54be00-32cf-11e9-9dcf-a9cb970f4a00.png)

To populate i would need to use this command
```
sequelize db:seed:all
```
![screenshot 543](https://user-images.githubusercontent.com/23324954/52915702-20b71800-32cf-11e9-946d-62c86deabcd2.png)

This shows that it worked
### Q6

```
const Sequelize = require('sequelize');
const sequelize = new Sequelize('pgguide', 'erika', '12ambionG', {
    host: 'localhost',
    dialect: 'postgres',
  
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
});

const models = require('./models/index');
const express = require('express');
const app = express();
const port = 3000;
const Users = require('./models').users;
const Products = require('./models').products;

// Or you can simply use a connection uri
//const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

//Check connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

/*
Setting For Part 1
*/

//Get users
app.get('/users', async (req, res) => {
  Users.findAll({ all: true, nested: true }).then(function (users) {
  res.json(users);
})
});

//Get users id
// Get the products by id
app.get('/users/:id', async (req, res) => {
  Users.findOne({
    where: 
    {
      id: req.params.id
    }
  }).then(function (users) {
    res.json(users);
  });
})

//Get products
app.get('/products', async (req, res) => {
    Products.findAll({ all: true, nested: true }).then(function (products) {
      res.json(products);
})
});

//GET /products[?name=string]
app.get('/productss', async (req, res) => {
  Products.findOne({
      where: 
      {
        title: req.query.name
      }
    }).then(function (products) {
      res.json(products);
    }); 
});

// Get the products by id
app.get('/products/:id', async (req, res) => {
  Products.findOne({
    where: 
    {
      id: req.params.id
    }
  }).then(function (products) {
    res.json(products);
  });
})

//

//Get purchases
// app.get('/purchases', async (req, res) => {
//     models.purchases.findAll({ all: true, nested: true }).then(function (purchases) {
//       res.json(purchases);
// })
// });

/*
Setting for the one that was not added
*/

// BodyParser used for postman
app.use(express.urlencoded());

// POST for new product
app.post('/products', async (req, res) => {
  if((req.body.hasOwnProperty('title')&req.body.hasOwnProperty('price')&req.body.hasOwnProperty('tags')))
  {
    //Product is created
    //http://docs.sequelizejs.com/manual/tutorial/instances.html#building-a-non-persistent-instance
    const products = Products.build({
      title: req.body.title,
      price: req.body.price,
      tags: req.body.tags.split(','),
      created_at: new Date(Date.now()).toISOString()
    });
    products.save()
  }
  else
  {
    console.log("Title, Price and Tags are needed")
  }
});

// Update product
app.put('/products/:id', (req, res) => {
  // Find product id
  Products.find({
    where: 
    {
      id: req.params.id
    }
  }).then((product) => {
    if(req.body.hasOwnProperty('title')) {
      product.update({
        title: req.body.title
      })
    }
    if(req.body.hasOwnProperty('price')) {
      product.update({
        price: req.body.price
      })
    }
    if(req.body.hasOwnProperty('tags')) {
      product.update({
        tags: req.body.tags.split(','),
      })
    }
  })
});

//Delete product
app.delete('/products/:id', async (req, res) => 
{
  Products.findOne({
    where: 
    {
      id: req.params.id
    }
  }).then((product) => {
    product.destroy()
  })
});

app.listen(port, () => console.log('Example app listening on port ${port}!'));
```
#### app.get Get
GET /products[?name=string]
```
http://localhost:3000/productss?name=Ukulele
```
![capture11](https://user-images.githubusercontent.com/23324954/52917583-1bfd5e80-32e5-11e9-801f-d87614a7c68d.PNG)

GET /products/:id
```
http://localhost:3000/products/17
```
![capture12](https://user-images.githubusercontent.com/23324954/52917601-6088fa00-32e5-11e9-81dd-086109785ecd.PNG)

#### app.post Post
```
http://localhost:3000/products?title=T-Shirt&price=15&tags=Clothes
```
![capture8](https://user-images.githubusercontent.com/23324954/52917527-70eca500-32e4-11e9-814e-ebe5c0c883bf.PNG)
#### app.put Update
```
http://localhost:3000/products/36?price=8&tags=childrens
```
![capture9](https://user-images.githubusercontent.com/23324954/52917526-70eca500-32e4-11e9-89f2-78795a198317.PNG)
#### app.delete Delete
```
http://localhost:3000/products/36
```
![capture10](https://user-images.githubusercontent.com/23324954/52917541-9aa5cc00-32e4-11e9-8f59-4d089291392b.PNG)
