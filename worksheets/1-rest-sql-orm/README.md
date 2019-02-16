[<b>Part 1:</b> Using Node, Express and Massive to create API endpoints](#part1)
- [Part 1.1: List all users email and sex in order of most recently created](#part1.1)
- [Part 1.2: List specified user's email and sex](#part1.2)
- [Part 1.3: List all products in ascending order of price](#part1.3)
- [Part 1.4: Show details of the specified product](#part1.4)
- [Part 1.5: List all purchase items](#part1.5)

[<b>Part 2:</b> Extend the '/products' Endpoint to **_Allow_** SQL Injection](#part2)<br><br>

[<b>Part 3:</b> Extend the '/products' Endpoint to **_Prevent_** SQL Injection](#part3)
- [GET /products[?name=string] - Parameterised Query](#part3.1)
- [GET /products[?name=string] - Stored Procedure](#part3.2)

[<b>Part 4:</b> Model Database and Migrate using Sequelize ORM](#part4)
- [Part 4.1: Model Users Table](#part4.1)
- [Part 4.2: Migrate Users Table](#part4.2)
- [Part 4.3: Model Products Table](#part4.3)
- [Part 4.4: Migrate Products Table](#part4.4)
- [Part 4.5: Model Purchases Table](#part4.5)
- [Part 4.6: Migrate Purchases Table](#part4.6)
- [Part 4.7: Model Purchase_Items Table](#part4.7)
- [Part 4.8: Migrate Purchase_Items Table](#part4.8)

[<b>Part 5:</b> Using Models and JS to Perform Bulk Inserts](#part5)
[<b>Part 6:</b> Reimplemented RESTful API using Sequelize and Express](#part6)

- [Part 1.1: List all users email and sex in order of most recently created](#part1.1)<br>
- [Part 1.2: List specified user's email and sex](#part1.2)<br>
- [Part 1.3: List all products in ascending order of price](#part1.3)<br>
- [Part 1.4: Show details of the specified product](#part1.4)<br>
- [Part 1.5: List all purchase items](#part1.5)<br>




<a name="part1"><h3>Part 1: Using Node, Express and Massive to create API endpoints</h3></a>

### Available Endpoints:

_/users_
<br>List all users email and sex in order of most recently created.

_/users/:id_
<br>List specified user's email and sex.

_/products_
<br>List all products in ascending order of price.

_/products/:id_
<br>Show details of the specified product.

_/purchases_
<br>List purchase items details by price in descending order, including:
- Receiver's name and address.
- Purchaser's email address.
- Price
- Quantity
- Delivery Status

_/products?name=title_
<br>Display products by a given title i.e. Action, Dictionary, Pop CD.


<a name="part1.1"><h3>1.1 GET /users</h3></a>

```javascript
/* 
List all users email and sex in order of most recently created. 
Do not include password hash in your output.
*/
app.get('/users', (req, res) => {
        db.users.find({}, {
                // filter results
                fields: 
                [
                        "email",
                        "details::json"
                ],
                // order results
                order: 
                [
                      {
                        field: 'created_at',
                        direction: 'desc',
                        nulls: 'first'
                      }  
                ]
        })
        // convert results to JSON for the response 
        .then(items => {
                res.json(items);
        });
});
```

<a name="part1.2"><h3>1.2 GET /users/:id</h3></a>

```javascript
/* 
List specified user's email and sex. 
Do not include password hash in your output.
*/
app.get('/users/:id', (req, res) => {
        // parse input to get the user ID value in its own
        console.log("req.params.id = " + req.params.id);
        // get the request parameters
        let id = req.params.id;
        // split on the colon (:)
        let userID = id.split(':')[1];
        // check output 
        console.log("clean string " + userID);

        // use clean ID value to get the user from DB
        db.users.find({'id = ' : userID}, {
                // filter results
                fields: 
                [
                        "email",
                        "details::json"
                ]
        })
        // convert results to JSON for the response 
        .then(items => {
                res.json(items);
        });
});
```

<a name="part1.3"><h3>1.3 GET /products</h3></a>

```javascript
/* 
List all products in ascending order of price OR Display specific Item - SQL Injection.
*/
app.get('/products', (req, res) => {
        if(req.query.name == undefined)
        {       // undefined if no name set, just return ALL products
                console.log("params are undefined"); 
                db.products.find({}, {
                        // order results
                        order: [
                                {
                                        field: 'price',
                                        direction: 'asc',
                                        nulls: 'first'
                                }  
                        ]
                })
                // convert results to JSON for the response 
                .then(items => {
                        res.json(items);
                });
        }
});
```

<a name="part1.4"><h3>1.4 GET /products/:id</h3></a>

```javascript
/* 
Show details of the specified product.
*/
app.get('/products/:id', (req, res) => {
        // parse input to get the user ID value in its own
        console.log("req.params.id = " + req.params.id);
        // get the request parameters
        let id = req.params.id;
        // split on the colon (:)
        let prodID = id.split(':')[1];
        // check output 
        console.log("clean string " + prodID);

        // use clean ID value to get the user from DB
        db.products.find({'id = ' : prodID})
        // convert results to JSON for the response 
        .then(items => {
                res.json(items);
        });
        
});
```

<a name="part1.5"><h3>1.5 GET /purchases</h3></a>

```javascript
/*
List purchase items to include:
> receiver’s name
> receiver's address
> purchaser’s email address 
> price
> quantity
> delivery status of the purchased item. 
-- Order by price in descending order
*/
app.get('/purchases', (req, res) => {
        let query = "SELECT P.NAME, P.ADDRESS, U.EMAIL, I.PRICE, I.QUANTITY, \
        I.STATE FROM PURCHASE_ITEMS I JOIN PURCHASES P ON (I.PURCHASE_ID = P.USER_ID) \
        JOIN USERS U ON (P.ID = U.ID) ORDER BY I.PRICE DESC;";

        db.query(query)
        .then(items => {
                res.json(items);
        });
});
```

<a name="part2"><h3>Part 2: Extend the '/products' Endpoint to **_Allow_** SQL Injection</h3></a>

##### GET /products[?name=string] - Possible SQL Injection
```javascript
/* 
List all products in ascending order of price OR Display specific Item - SQL Injection.
*/
app.get('/products', (req, res) => {
        if(req.query.name == undefined)
        {       // undefined if no name set, just return ALL products
                console.log("params are undefined"); 
                db.products.find({}, {
                        // order results
                        order: [
                                {
                                        field: 'price',
                                        direction: 'asc',
                                        nulls: 'first'
                                }  
                        ]
                })
                // convert results to JSON for the response 
                .then(items => {
                        res.json(items);
                });
        }
        // List specific product details. Attempt SQL Injection. 
        else    
        {
                console.log("params are defined: " + req.query.name);
                
                // SQL INJECTION STRING
                //Action'; INSERT INTO USERS (email, password) VALUES ('hello', 'world');--
                
                // UNSAFE
                db.query("SELECT * FROM PRODUCTS WHERE TITLE = '" + req.query.name + "';")
                .then(items => {
                        res.json(items);
                });
        }
});
```
<a name="part3"><h3>Part 3: Extend the '/products' Endpoint to **_Prevent_** SQL Injection</h3></a>
<a name="part3.1"><h5>GET /products[?name=string] - Parameterised Query</h5></a>

```javascript
/* 
List all products in ascending order of price OR Display specific Item - SQL Injection.
*/
app.get('/products', (req, res) => {
        if(req.query.name == undefined)
        {       // undefined if no name set, just return ALL products
                console.log("params are undefined"); 
                db.products.find({}, {
                        // order results
                        order: [
                                {
                                        field: 'price',
                                        direction: 'asc',
                                        nulls: 'first'
                                }  
                        ]
                })
                // convert results to JSON for the response 
                .then(items => {
                        res.json(items);
                });
        }
        // List specific product details. Attempt SQL Injection. 
        else    
        {
                console.log("params are defined: " + req.query.name);
                
                // SQL INJECTION STRING
                //Action'; INSERT INTO USERS (email, password) VALUES ('hello', 'world');--
                
                // PARAMETERISED QUERY                
                const query = "SELECT * FROM PRODUCTS WHERE INITCAP(TITLE) = INITCAP($1)"; 
                db.query(query, req.query.name)
                        .then(items => {
                                res.json(items);
                        });                   
        }
});
```
<a name="part3.2"><h5>GET /products[?name=string] - Stored Procedure</h5></a>

```javascript
/* 
List all products in ascending order of price OR Display specific Item - SQL Injection.
*/
app.get('/products', (req, res) => {
        if(req.query.name == undefined)
        {       // undefined if no name set, just return ALL products
                console.log("params are undefined"); 
                db.products.find({}, {
                        // order results
                        order: [
                                {
                                        field: 'price',
                                        direction: 'asc',
                                        nulls: 'first'
                                }  
                        ]
                })
                // convert results to JSON for the response 
                .then(items => {
                        res.json(items);
                });
        }
        // List specific product details. Attempt SQL Injection. 
        else    
        {
                console.log("params are defined: " + req.query.name);
                
                // SQL INJECTION STRING
                //Action'; INSERT INTO USERS (email, password) VALUES ('hello', 'world');--
                
                // STORED PROCEDURE
                db.getproductbytitle(req.query.name)
                        .then(items => {
                                res.json(items);
                        });               
        }
});
```

<a name="part4"><h3>Part 4: Model Database and Migrate using Sequelize ORM</h3></a>
<a name="part4.1"><h5>Model Users Table</h5></a>

```javascript
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

```
<a name="part4.2"><h5>Migrate Users Table</h5></a>

```javascript
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      details: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false, type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: false, type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false, type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
```
<a name="part4.3"><h5>Model Products Table</h5></a>

```javascript
'use strict';
module.exports = function(sequelize, DataTypes) {
  var products = sequelize.define('products', {
    title: DataTypes.STRING,
    price: DataTypes.INTEGER, 
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at"
    }, 
    deletedAt: {
      type: DataTypes.DATE,
      field: "deleted_at"
    }, 
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    }
   }, {
    timestamps: false
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return products;
};
```

<a name="part4.4"><h5>Migrate Products Table</h5></a>

```javascript
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('products', {
      id: {
        allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      createdAt: {
        allowNull: false, type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: false, type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false, type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('products');
  }
};
```

<a name="part4.5"><h5>Model Purchases Table</h5></a>

```javascript
'use strict';
module.exports = function(sequelize, DataTypes) {
  var purchases = sequelize.define('purchases', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING, 
    zipcode: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER, 
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at"
    },
  }, {
    timestamps: false
  }, {
    classMethods: {
      associate: function(models) {
        purchases.belongsTo(models.users, {foreignKey: 'user_id'});
      }
    }
  });
  return purchases;
};
```

<a name="part4.6"><h5>Migrate Purchases Table</h5></a>

```javascript
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('purchases', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
      name: {type: Sequelize.STRING},
      address: {type: Sequelize.STRING},
      state: {type: Sequelize.STRING},
      zipcode: {type: Sequelize.STRING},
      user_id: {type: Sequelize.INTEGER,
        references: {
          model : "users",
          key   : "id"
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE},
      updatedAt: { allowNull: false, type: Sequelize.DATE}
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('purchases');
  }
};
```

<a name="part4.7"><h5>Model Purchase_Items Table</h5></a>

```javascript
'use strict';
module.exports = function(sequelize, DataTypes) {
  var purchase_items = sequelize.define('purchase_items', {
    purchase_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {
    timestamps: false
  }, {
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

<a name="part4.8"><h5>Migrate Purchase_Items Table</h5></a>

```javascript
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('purchase_items', {
      id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
      purchase_id: {type: Sequelize.INTEGER,
        references : { model : "purchases", key : "id"},
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      product_id: {type: Sequelize.INTEGER,
        references : { model : "products", key : "id"},
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      price: {type: Sequelize.INTEGER},
      quantity: {type: Sequelize.INTEGER},
      state: {type: Sequelize.STRING},
      createdAt: {allowNull: false, type: Sequelize.DATE},
      updatedAt: {allowNull: false, type: Sequelize.DATE}
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('purchase_items');
  }
};
```

<a name="part5"><h3>Part 5: Using Models and JS to Perform Bulk Inserts</h3></a>

Inserts and Delete of bulk data were performed using seeder files and seed commands: 
```
db:seed:all             // to seed all inserts
db:seed:undo:all        // to deseed/delete all inserts
```

### Seed File for Users Table
```javascript
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    var today = new Date();
      return queryInterface.bulkInsert('users', [
        {
          email: 'jdoe@gmail.com',
          password: 'homer',
          created_at: today,
          details: '"sex"=>"M", "state"=>"Illinois"'
        },
        {
          email: 'hidey@gmail.com',
          password: 'banana',
          created_at: today,
          details: '"sex"=>"F", "state"=>"Maryland"'
        }
      ], {});
  },
  down: (queryInterface, Sequelize) =>{
      return queryInterface.bulkDelete('users', {
        email: [
          'jdoe@gmail.com',
          'hidey@gmail.com'
        ]
      });
  }
};
```


### Seed File for Products Table
```javascript
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    var today = new Date();
    return queryInterface.bulkInsert('products', [
      {
        title: 'Kite',
        price: '3.99',
        created_at: today,
        tags: ['Toy', 'Children']
      },
      {
        title: 'Bike',
        price: '113.99',
        created_at: today,
        tags: ['Toy', 'Children']
      }
    ], {});
},
down: (queryInterface, Sequelize) =>{
    return queryInterface.bulkDelete('products', {
      title: [
        'Bike',
        'Kite'
      ]
    });
  }
};
```

### Seed File for Purchases Table
```javascript
'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
      var today = new Date();
      return queryInterface.bulkInsert('purchases', [
        {
          created_at: today,
          name: 'John Doe',
          address: '123 Fake Street',
          state: 'NY',
          zipcode: '90210',
          user_id: '3'
        },
        {
          created_at: today,
          name: 'Mary Byrne',
          address: '999 World Street',
          state: 'CA',
          zipcode: '90210',
          user_id: '12'
        }
      ], {});
  },
  down: (queryInterface, Sequelize) =>{
      return queryInterface.bulkDelete('purchases', {
        name: [
          'John Doe',
          'Mary Byrne'
        ]
      });
}};
```

### Seed File for Purchase_Items Table
```javascript
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('purchase_items', [
      {
        purchase_id: '2',
        product_id: '3',
        price: '666.66',
        quantity: '2',
        state: 'Pending'
      },
      {
        purchase_id: '22',
        product_id: '20',
        price: '777.77',
        quantity: '7',
        state: 'Pending'
      }
    ], {});
},
down: (queryInterface, Sequelize) =>{
    return queryInterface.bulkDelete('purchase_items', {
      purchase_id: ['2', '22'],
      product_id: ['3',  '20'],
      state: ['Pending']
    });
  }
};
```

<a name="part5"><h3>Part 6: Reimplemented RESTful API using Sequelize and Express</h3></a>

### GET /products
```javascript
/*
List all products.
CURL COMMAND: curl http://127.0.0.1:3000/products
*/
router.get('/products', (req, res) =>{
  models.products.findAll({})
  .then(products => {
    res.json(products);
  });
});
```

### GET /products/:id
```javascript
/* 
Show details of the specified product.
CURL COMMAND: curl http://127.0.0.1:3000/products/:11
*/
router.get('/products/:id', (req, res) =>{
  // parse input to get the user ID value on its own
  console.log("req.params.id = " + req.params.id);
  // get the request parameters
  let id = req.params.id;
  // split on the colon (:)
  let prodID = id.split(':')[1];
  // check output 
  console.log("clean string " + prodID);

  // use clean ID value to get the product from DB
  models.products.find({
    where: {
      id: prodID
    }
  })
  // convert results to JSON for the response 
  .then(items => {
    res.json(items);
  });
});
```

### POST /products
```javascript
/*
Create a new product instance
CURL COMMAND: curl --data "title=Doll&price=11.99&tags=Toy&tags=Children" http://127.0.0.1:3000/products
*/
router.post('/products', (req, res) => {
  console.log(req.query.tags);
  var createdAt = new Date();
  models.products.create({
    title: req.body.title,
    price: req.body.price,
    createdAt: createdAt,
    tags: req.body.tags
  })
  .then(user => {
    res.json(user);
  });
});
```

### PUT /products/:id
```javascript
/*
Update an existing product.
CURL COMMAND: curl -X PUT --data "title=Dictionary&price=22.99&tags=Book&tags=Reference" http://127.0.0.1:3000/products/:1
*/
router.put('/products/:id', (req, res) =>{
  // parse input to get the product ID value on its own
  console.log("req.params.id = " + req.params.id);
  // get the request parameters
  let id = req.params.id;
  // split on the colon (:)
  let prodID = id.split(':')[1];
  // check output 
  console.log("clean string " + prodID);
  models.products.find({
    where: {
      id: prodID
    }
  }).then(products => {
    if(products){
      products.updateAttributes({
        title: req.body.title,
        price: req.body.price,
        tags: req.body.tags
      }).then(products => {
        res.send(products);
      });
    }
  });
});
```

### DELETE /products/:id
```javascript
/*
Remove an existing product.
CURL COMMAND: curl -X DELETE http://127.0.0.1:3000/products/:44
*/
router.delete('/products/:id', (req, res) =>{
  // parse input to get the product ID value on its own
  console.log("req.params.id = " + req.params.id);
  // get the request parameters
  let id = req.params.id;
  // split on the colon (:)
  let prodID = id.split(':')[1];
  // check output 
  console.log("clean string " + prodID);

  // use clean ID value to get the product from DB
  models.products.destroy({
    where: {
      id: prodID
    }
  })
  // convert results to JSON for the response 
  .then(items => {
    res.json(items);
  });
});
```
