## Part 1: Using Node, Express and Massive to create API endpoints

### 1.1 GET /users

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


### 1.2 GET /users/:id
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

### 1.3 GET /products
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

### 1.4 GET /products/:id
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


### 1.5 GET /purchases

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

## Part 2: Extend the '/products' Endpoint to **_Allow_** SQL Injection

### GET /products[?name=string] - Possible SQL Injection
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

## Part 3: Extend the '/products' Endpoint to **_Prevent_** SQL Injection

### GET /products[?name=string] - Parameterised Query
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

### GET /products[?name=string] - Stored Procedure
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

## Part 4: Model Database and Migrate using Sequelize ORM

### Model Users Table
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
### Migrate Users Table
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

### Model Products Table
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

### Migrate Products Table
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

### Model Purchases Table
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

### Migrate Purchases Table
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

### Model Purchase_Items Table
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

### Migrate Purchase_Items Table
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

## Part 5: Using Models and JS to Perform Bulk Inserts

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

## Part 6: Reimplemented RESTful API using Sequelize and Express

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
