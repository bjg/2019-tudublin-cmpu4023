## Question 1
![GET Users](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/Massive/getUsers.png)

![GET UserID](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/Massive/getUserID.png)

![GET Products](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/Massive/getProducts.png)
![GET productID](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/Massive/getProductID.png)

![GET Purchases](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/Massive/getPurchases.png)



## Question 2
![GET productString](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/Massive/getProductString.png)

### SQL Injeciton
![SQL Injection Postman](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/SQL_Bad_Injeciton/SQLInjectionDELETEUser.png)
![SQL Injection DB Before](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/SQL_Bad_Injeciton/SQLInjectionBefore.png)
![SQL Injection DB After](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/SQL_Bad_Injeciton/SQLInjectionAfter.png)


## Question 3

``` javascript
/**
 * Exprees /GET Route, pass the defined route and results to a callback function.
 *
 * @function get
 * @param {string} - 'purchases'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

/**
 * Paramaterised Query to the postgress database
 * This section deals with the unsafe SQL query above by using a paramaterised Query
 * localhost:3000/products/safe2?name=Dictionary
 * 
 * @returns {Promise} A promise that returns data object of the resulting psql query if resolved
 */

/**
 * express().send()
 * 
 * @param {object} err - the resulting error is send in full to the client
 */
app.get('/products/safe1/:name', function(req, res, next) {
    let name = req.params.name
    req.app.get('db').query('SELECT * FROM products WHERE title = $1', [name])
        .then(result => res.send(result))
        .catch(err => res.send(err))
})
```


``` javascript
app.get('/products/safe2/:name', function(req, res, next) {
    let name = req.params.name
    req.app.get('db').products.find({ title: name })
        .then(result => res.send(result))
        .catch(err => res.send(err))
})
```


## Question 4
![Sequelize DB Connection](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/SequelizeConnection.png)

``` javascript 
/**
 * Sequelize Constructor Object
 *
 * @property {(function|function[])} host: The host of the relational database.
 * @property {(function|function[])} dialect: The dialect of the database you are connecting to. One of mysql, postgres, sqlite and mssql.
 * @property {(function|function[])} operatorsAliases: Posgress database name
 * @property {(function|function[])} pool: Posgress server username
 */
const sequelize = new Sequelize('postgres', 'postgres', 'supersafepassword', {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})
```

``` javascript 
/**
 * Question 4
 * Initial connection between sequelize and our postgress database
 *
 * @function authenticate 
 */

/**
 * Test the connection by trying to authenticate the connection
 * 
 * @returns {Promise} No returned objects
 */
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
        app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })
```

Define Products Model

``` javascript
/**
 * Define a new model, representing a table in the DB.
 * @param {string} 'product' - Name of the Table
 * @param {Object} attributes - Each attribute is a column in the table
 * @param {Object} options 
 * @description Specifies product Table.
 * 
 * @property {attribute} id: ID of the Product, Primary Key, and auto increment
 * @property {attribute} title: Title of the Product
 * @property {attribute} price: Price of the Product
 * @property {attribute} created_at: Auto timestamp upon creation
 * @property {attribute} deleted_at: Timestamp at deletion
 * @property {attribute} tags: SEO product tags
 */
const Products = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true
        }
    },
    price: {
        type: Sequelize.FLOAT(10),
        validate:{
          isFloat: true,
          min: 0.0
        }
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: sequelize.fn('NOW')
    },
    deleted_at: {
        type: Sequelize.DATE,
        defaultValue: null
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
    }
}, {
    timestamps: false
})
```

Associations

``` javascript 
// Associations
// foreign id's will automatically be added
// We use hasOne to add the foreign id to the target model.(Model name before full-stop)
Purchases.belongsTo(Users, {
    foreignKey: {
        name: 'user_id',
        allowNull: false
    }
})

Purchase_Item.belongsTo(Purchases,{
  foreignKey: {
    name: 'purchase_id',
    allowNull: false
  }
})

Purchase_Item.belongsTo(Products,{
  foreignKey: {
    name: 'product_id',
    allowNull: false
  }
})
```

## Question 5 
Create a user with an assigned Purchase created in the same instance 

``` javascript
Users.create({
    email: chance.first() + '.' + chance.last() + chance.email({ domain: 'gmail.com' }),
    password: randomString(32),
    details: 'sex=>' + chance.gender().charAt(0)
}).then(users => {
    Purchases.create({
        name: users.get('email').match(/\w+.\w+/g)[0].replace('.',' '),
        address: chance.address({ short_suffix: true }) + '.',
        state: chance.state(),
        zipcode: chance.zip(),
        user_id: users.get('id')
    }, {
        include: Users
    }).then(purchase => {
        purchase.save()
    }).catch(err => {
        console.log(err)
    })

    users.save()
}).catch(err => {
    console.log(err)
})
```

Alternatively, we already have a user created and we now need to add a new purchase and associate it to them
``` javascript
Users.findByPk(1).then(userData =>{
  Purchases.create({

    name: userData.get('email').match(/\w+.\w+/g)[0].replace('.', ' '),
    address: chance.address({ short_suffix: true }) + '.',
    state: chance.state(),
    zipcode: chance.zip(),
    user_id: userData.get('id')
}, {
    include: Users
}).then(purchase => {
    purchase.save()
}).catch(err => {
    console.log(err)
})
})
```

## Question 6
CRUD Implementation with Sequwlize 

/GET
![GET Products](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/Sequelize_GET/Screenshot%20(17).png)
![GET Products ID](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/Sequelize_GET/Screenshot%20(18).png)

/POST
![POST DB View](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/Sequelize_POST/Screenshot%20(21).png)
![POST Sequelize View)](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/Sequelize_POST/Screenshot%20(20).png)
![POST Postman View](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/Sequelize_POST/Screenshot%20(19).png)

/PUT
![PUT Postman View](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/Sequelize_PUT/PUT_PostMan_View.png)
![PUT DB View](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/Sequelize_PUT/PUT__DB_View.png)

/DELETE
![DELETE DB View](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/Sequelize_DELETE/DELETE_DB_View.png)
![DELETE Postman View](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/Sequelize_DELETE/DELETE_PostMan.png)
![DELETE Sequelize View](https://github.com/Ciaran-OBrien/Enterprise-Application-Development/blob/master/Lab%201/Images/Sequelize_DELETE/DELETE_DB_View.png)
