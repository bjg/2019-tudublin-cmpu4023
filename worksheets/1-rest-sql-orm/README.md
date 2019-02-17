<a name="top"><h1>REST API, SQL and ORM</h1></a>

### Contents
- Create a simple HTTP endpoint in NodeJS
- Interface between Node and Postgres using Massive JS
- Execute simple Postgres queries using SQL and expose those using an HTTP API
- Demonstrate how SQL injection can be performed on a badly implemented RDMBS backend interface
- Implement SQL-injection proofing in the implementation
- Implement an API model layer using the Sequelize object relational mapper
- Implement API in Express using an ORM-based model layer
---

[**Part 1: Using Node, Express and Massive to create API endpoints**](#part1)
- [Part 1.1: List all available endpoints](#part1.1)
- [Part 1.2: List all users email and sex in order of most recently created](#part1.2)
- [Part 1.3: List specified user's email and sex](#part1.3)
- [Part 1.4: List all products in ascending order of price](#part1.4)
- [Part 1.5: Show details of the specified product](#part1.5)
- [Part 1.6: List all purchase items](#part1.6)

[**Part 2: Extend the '/products' Endpoint to **_Allow_** SQL Injection**](#part2)
- [Part 2.1: GET /products[?name=string] - Possible SQL Injection](#part2.1)

[**Part 3: Extend the '/products' Endpoint to **_Prevent_** SQL Injection**](#part3)
- [Part 3.1: GET /products[?name=string] - Parameterised Query](#part3.1)
- [Part 3.2: GET /products[?name=string] - Stored Procedure](#part3.2)

[**Part 4: Model Database and Migrate using Sequelize ORM**](#part4)
- [Part 4.1: Model Users Table](#part4.1)
- [Part 4.2: Migrate Users Table](#part4.2)
- [Part 4.3: Model Products Table](#part4.3)
- [Part 4.4: Migrate Products Table](#part4.4)
- [Part 4.5: Model Purchases Table](#part4.5)
- [Part 4.6: Migrate Purchases Table](#part4.6)
- [Part 4.7: Model Purchase_Items Table](#part4.7)
- [Part 4.8: Migrate Purchase_Items Table](#part4.8)

[**Part 5: Using Models and JS to Perform Bulk Inserts**](#part5)
- [Part 5.1: Seed File for Users Table](#part5.1)
- [Part 5.2: Seed File for Products Table](#part5.2)
- [Part 5.3: Seed File for Purchases Table](#part5.3)
- [Part 5.4: Seed File for Purchase_Items Table](#part5.4)

[**Part 6: Reimplemented RESTful API using Sequelize and Express**](#part6)
- [Part 6.1: List all available endpoints](#part6.1)
- [Part 6.2: List all products](#part6.2)
- [Part 6.3: Show details of the specified product](#part6.3)
- [Part 6.4: Create a new product instance](#part6.4)
- [Part 6.5: Update an existing product](#part6.5)
- [Part 6.6: Remove an existing product](#part6.6)

[Back to Top](#top)

<a name="part1"><h2>Part 1: Using Node, Express and Massive to create API endpoints</h2></a>
<a name="part1.1"><h3>Part 1.1: Available Endpoints:</h3></a>

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

[Back to Top](#top)

<a name="part1.2"><h3>1.2 GET /users</h3></a>

```javascript
/* 
List all users email and sex in order of most recently created. 
This code allows for a situation where no SEX value is included, but 
where other DETAILS (i.e. STATE) may have been supplied
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
              direction: 'desc'
            }  
      ]
  })
  // convert results to JSON for the response 
  .then(items => {
      let user_info = [];

      items.forEach(element => {
          if(element['details'] != null)
          {
            user_info.push({
                    "email": element['email'],
                    // if the DETAILS are not null, but no SEX value was disclosed i.e. just the STATE is disclosed
                    // then the SEX value should also be "Undisclosed"
                    "sex": (element['details']['sex']) ? element['details']['sex'] : "Undisclosed"
            });
          }
          else
          {
            user_info.push({
                    "email": element['email'],
                    "sex": "Undisclosed"
            });
          }
      });
      res.json(user_info);
  });
});
```
<h3>Results:</h3>

![massive_users](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/massive_users.png "http://localhost:3000/users")

[Back to Top](#top)
<a name="part1.3"><h3>1.3 GET /users/:id</h3></a>

```javascript
/* 
List specified user's email and sex. 
If details=>sex are not supplied but details=>state are supplied then sex returns as "Undisclosed"
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
                "id",
                "email",
                "details::json"
        ]
    })
    // convert results to JSON for the response 
    .then(items => {
        let user = {
                "id": items[0].id,
                "email": items[0].email,
                // if no SEX value is defined, then output is "Undisclosed"
                "sex": items[0].details.sex ? items[0].details.sex : "Undisclosed"
        };

        res.json(user);
    });
});
```

<h3>Results:</h3>

| Details: "sex"=>"M" | Details: "state"=>"Maryland" |
| :-------: | :----------:|
| ![massive_user_id_disclosed](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/massive_user_id_disclosed.png "http://localhost:3000/users/:11")| ![massive_user_id_undisclosed](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/massive_user_id_undisclosed.png "http://localhost:3000/users/:1") |




[Back to Top](#top)
<a name="part1.4"><h3>1.4 GET /products</h3></a>

```javascript
/* 
List all products in ascending order of price.
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

<h3>Results:</h3>

![massive_products](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/massive_products.png "http://localhost:3000/products/:3")

[Back to Top](#top)
<a name="part1.5"><h3>1.5 GET /products/:id</h3></a>

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

<h3>Results:</h3>

![massive_product_id](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/massive_product_id.png "http://localhost:3000/products/:3")

[Back to Top](#top)
<a name="part1.6"><h3>1.6 GET /purchases</h3></a>

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

<h3>Results:</h3>

![massive_purchases](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/massive_purchases.png "http://localhost:3000/purchases")

[Back to Top](#top)
<a name="part2"><h2>Part 2: Extend the '/products' Endpoint to **_Allow_** SQL Injection</h2></a>
The purpose of this excercise is to extend the _/products_ endpoint to allow the user to search for a product by title, but implemented in a securely poor manner, so as to allow the user to inject SQL into the database and give the user unpermissioned access.

<a name="part2.1"><h3>2.1 GET /products[?name=string] - Possible SQL Injection</h3></a>

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

<h3>Results:</h3>

Using _simple SQL query_ syntax it was possible to add a new user to the database. The user-inputted SQL query was simply concatenated to the SQL code in the main javascript file and called without any safety checks. 

This was performed by entering the following into the browser address bar:
localhost:3000/products?name=Action'; INSERT INTO USERS (email, password) VALUES ('hello', 'world');--

The -- at the end of the query comments out any SQL syntax that comes after it and the illegal user is added to the database. 

![massive_sql_injection](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/massive_sql_injection.png "http://localhost:3000/products_sql_injection")

[Back to Top](#top)
<a name="part3"><h2>Part 3: Extend the '/products' Endpoint to **_Prevent_** SQL Injection</h2></a>
In this section, the previous poor security implementation of the _/products_ endpoint is remedied using two solutions: 
- _parameterised query_
- _stored procedure_

<a name="part3.1"><h3>3.1 GET /products[?name=string] - Parameterised Query</h3></a>

```javascript
/* 
List all products in ascending order of price OR Display specific Item - Parameterised Query.
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

<h3>Results:</h3>

By using a _parameterised query_ it was not possible to inject values into the database. The use of _$1_ as a variable placeholder prevented the injection occuring.  A parameterised query allows for the construction of a _query plan_ on the server _before_ the query is executed with parameter values.

![massive_parameterised_query](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/massive_parameterised_query.png "http://localhost:3000/products_parameterised_query")


[Back to Top](#top)
<a name="part3.2"><h3>3.2 GET /products[?name=string] - Stored Procedure</h3></a>

```javascript
/* 
List all products in ascending order of price OR Display specific Item - Stored Procedure.
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

<h3>Results:</h3>

By using a _stored procedure_ it was not possible to inject values into the database. With a stored procedure there exists an execution plan for the SELECT query on the server before the query is executed. The plan only allows the original query to be executed. Parameter values (even if they are injected SQL) won’t be executed because they are not part of the execution plan. Any input will be treated as user input, not SQL code and will not execute unexpected SQL code that is not part of the execution plan.

![massive_stored_procedure](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/massive_stored_procedure.png "http://localhost:3000/products_stored_procedure")

[Back to Top](#top)
<a name="part4"><h2>Part 4: Model Database and Migrate using Sequelize ORM</h2></a>
Model files were created using Sequelize for each of the tables in the database. Once created, Sequelize also auto-generated migration files to map the _pgguide_ database. _Referential Integrity_ is ensured through the use of _primaryKeys_, _foreignKeys_ and _associations_ as highlighted in the code snippets that follow. 

<a name="part4.1"><h3>4.1 Model Users Table</h3></a>

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
      }
    }
  });
  return users;
};

```

[Back to Top](#top)
<a name="part4.2"><h3>4.2 Migrate Users Table</h3></a>

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

[Back to Top](#top)
<a name="part4.3"><h3>4.3 Model Products Table</h3></a>

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

[Back to Top](#top)
<a name="part4.4"><h3>4.4 Migrate Products Table</h3></a>

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

[Back to Top](#top)
<a name="part4.5"><h3>4.5 Model Purchases Table</h3></a>

```javascript
'use strict';
module.exports = function(sequelize, DataTypes) {
  var purchases = sequelize.define('purchases', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING, 
    zipcode: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,                 // foreignKey
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at"
    },
  }, {
    timestamps: false
  }, {
    classMethods: {
      associate: function(models) {
        purchases.belongsTo(models.users, {foreignKey: 'user_id'});     // ensures referential integrity
      }
    }
  });
  return purchases;
};
```

[Back to Top](#top)
<a name="part4.6"><h3>4.6 Migrate Purchases Table</h3></a>

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
      user_id: {type: Sequelize.INTEGER,                // foreignKey
        references: {model : "users", key   : "id"},    // ensures referential integrity
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE},
      updatedAt: { allowNull: false, type: Sequelize.DATE}
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('purchases');       // ensures referential integrity
  }
};
```

[Back to Top](#top)
<a name="part4.7"><h3>4.7 Model Purchase_Items Table</h3></a>

```javascript
'use strict';
module.exports = function(sequelize, DataTypes) {
  var purchase_items = sequelize.define('purchase_items', {
    purchase_id: DataTypes.INTEGER,                     // foreignKey
    product_id: DataTypes.INTEGER,                      //foreignKey
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {
    timestamps: false
  }, {
    classMethods: {
      associate: function(models) {
        purchase_items.belongsTo(models.purchases, {foreignKey: 'purchase_id'}); // ensures referential integrity
        purchase_items.belongsTo(models.products, {foreignKey: 'product_id'});   // ensures referential integrity
      }
    }
  });
  return purchase_items;
};
```

[Back to Top](#top)
<a name="part4.8"><h3>4.8 Migrate Purchase_Items Table</h3></a>

```javascript
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('purchase_items', {
      id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
      purchase_id: {type: Sequelize.INTEGER,                    // foreignKey
        references : { model : "purchases", key : "id"},        // ensures referential integrity
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      product_id: {type: Sequelize.INTEGER,                     // foreignKey
        references : { model : "products", key : "id"},         // ensures referential integrity
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

[Back to Top](#top)
<a name="part5"><h2>Part 5: Using Models and JS to Perform Bulk Inserts</h2></a>

Inserts and Deletes of bulk data were performed using seeder files _(up/down functions)_ and seed commands. Seed files were created in a specific order _(users > products > purchases > purchase_items)_ and timestamped so they could be called without conflicts through referential constraints.  
```
node_modules/.bin/sequelize db:seed              // to seed all inserts
node_modules/.bin/sequelize db:seed:undo:all     // to deseed/delete all inserts
```

<h3>Console: Seed</h3>

![sequelize_db_seed](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/sequelize_db_seed.png "http://localhost:3000/sequelize_db_seed")

<h3>Console: De-seed</h3>

![sequelize_db_seed_undo](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/sequelize_db_seed_undo.png "http://localhost:3000/sequelize_db_seed_undo")

<a name="part5.1"><h3>5.1 Seed File for Users Table</h3></a>

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

[Back to Top](#top)
<a name="part5.2"><h3>5.2 Seed File for Products Table</h3></a>

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

[Back to Top](#top)
<a name="part5.3"><h3>5.3 Seed File for Purchases Table</h3></a>

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

[Back to Top](#top)
<a name="part5.4"><h3>5.4 Seed File for Purchase_Items Table</h3></a>

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

[Back to Top](#top)
<a name="part6"><h2>Part 6: Reimplemented RESTful API using Sequelize and Express</h2></a>
<a name="part6.1"><h3>Part 6.1: Available Endpoints:</h3></a>

_GET /products_
<br>List all products.

_GET /products/:id_
<br>Show detials of the specified product.

_POST /products_
<br>Create a new product instance.

_PUT /products/:id_
<br>Update an existing product.

_DELETE /products/:id_
<br>Remove an existing product. 

[Back to Top](#top)
<a name="part6.2"><h3>6.2 GET /products</h3></a>
```
curl http://127.0.0.1:3000/products
```

```javascript
/*
List all products.
*/
router.get('/products', (req, res) =>{
  models.products.findAll({})
  .then(products => {
    res.json(products);
  });
});
```

<h3>Results:</h3>

![sequelize_products](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/sequelize_products.png "http://localhost:3000/sequelize_products")

[Back to Top](#top)
<a name="part6.3"><h3>6.3 GET /products/:id</h3></a>
```
curl http://127.0.0.1:3000/products/:5
```

```javascript
/* 
Show details of the specified product.
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

<h3>Results:</h3>

![sequelize_product_id](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/sequelize_product_id.png "http://localhost:3000/sequelize_product_id")

[Back to Top](#top)
<a name="part6.4"><h3>6.4 POST /products</h3></a>
```
curl --data "title=Doll&price=11.99&tags=Toy&tags=Children" http://127.0.0.1:3000/products
```

```javascript
/*
Create a new product instance
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

<h3>Results:</h3>

![sequelize_product_insert](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/sequelize_product_insert.png "http://localhost:3000/sequelize_product_insert")

[Back to Top](#top)
<a name="part6.5"><h3>6.5 PUT /products/:id</h3></a>
```
curl -X PUT --data "title=Dictionary&price=222.99&tags=Book&tags=Reference" http://127.0.0.1:3000/products/:1
```

```javascript
/*
Update an existing product.
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

<h3>Results:</h3>

![sequelize_product_update](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/sequelize_product_update.png "http://localhost:3000/sequelize_product_update")

[Back to Top](#top)
<a name="part6.6"><h3>6.6 DELETE /products/:id</h3></a>
```
curl -X DELETE http://127.0.0.1:3000/products/:50
```

```javascript
/*
Remove an existing product.
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

<h3>Results:</h3>

![sequelize_product_delete1](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/sequelize_product_delete1.png "http://localhost:3000/sequelize_product_delete1")

![sequelize_product_delete2](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/sequelize_product_delete2.png "http://localhost:3000/sequelize_product_delete2")