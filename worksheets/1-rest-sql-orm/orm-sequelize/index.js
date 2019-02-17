const express = require('express')
const app = express()
const port = 3000

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/*
Part 4 
Create Sequalize migrations for the ​ pgguide​ sample database
*/
const Sequelize = require('sequelize');
const DataTypes = require('sequelize/lib/data-types');
const sequelize = new Sequelize('pgguide', 'ronan', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});


sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});


const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    details: {
        type: Sequelize.STRING
    },
    created_at: {
        type: Sequelize.DATE
    },
    deleted_at: {
        type: Sequelize.DATE
    }
},{
  timestamps: false 
});



const Purchase = sequelize.define('purchase', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: {
        type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
    state: {
        type: Sequelize.STRING
    },
    zipcode: {
        type: Sequelize.INTEGER
    },
    user_id: {
        type: Sequelize.INTEGER
    },
},{
  timestamps: false 
});


const PurchaseItem = sequelize.define('purchase_item', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    purchase_id: {
      type: Sequelize.INTEGER,
    },
    product_id: {
        type: Sequelize.INTEGER,
    },
    price: {
        type: Sequelize.STRING
    },
    quantity: {
        type: Sequelize.INTEGER
    },
    state:{
        type: Sequelize.STRING
    }
},{
  timestamps: false 
});


const Product = sequelize.define('product', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
        type: Sequelize.STRING
    },
    price: {
      type: Sequelize.STRING
    },
    created_at: {
        type: Sequelize.STRING
    },
    deleted_at: {
        type: Sequelize.STRING
    },
    tags: {
        type: Sequelize.ARRAY(DataTypes.TEXT)
    }
},{
  timestamps: false 
});

// Relationships

User.hasMany(Purchase,{foreignKey: 'user_id', sourceKey: 'id'});
Purchase.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'});

Purchase.hasMany(PurchaseItem,{foreignKey:'purchase_id',sourceKey:'id'});
PurchaseItem.belongsTo(Purchase,{foreignKey:'purchase_id',targetKey:'id'});

Product.hasMany(PurchaseItem,{foreignKey:'product_id',sourceKey:'id',onDelete: 'cascade', hooks: true});
PurchaseItem.belongsTo(Product,{foreignKey:'product_id',targetKey:'id',onDelete: 'cascade', hooks: true});



/*
Part 5
Use your models and Javascript code to populate the database with some
additional test data for all of the models above


/*

const u = User.build({email:"Joe.Joe@yahoo.com",password:"password",details:null,created_at:"2019-02-14T20:36:00.000Z",deleted_at:null});

u.save().then(()=>{
  console.log("User inserted successfully");
}).catch(error =>{
  console.log(error);
});

//{"id":1,"title":"Dictionary","price":"9.99","created_at":"2011-01-01T20:00:00.000Z","deleted_at":null,"tags":["Book"]}
const prod = Product.build({title:"Man in the High Castel",price:"12.40",created_at:"2019-02-14T20:00:00.000Z",deleted_at:null,tags:["Book"]})

prod.save().then(()=>{
  console.log("Product inserted successfully");
}).catch(error =>{
  console.log(error);
});


const pur = Purchase.build({id:1001,created_at:"2011-03-16T15:03:00.000Z",name:"Earlean Bonacci",address:"6425 43rd St.",state:"FL",zipcode:50382,user_id:1});

const pur_item = PurchaseItem.build({id:2500,purchase_id:1001,product_id:1,price:"9.99",quantity:1,state:"Delivered"});

pur.save().then(() => {
  console.log("Purchase insert Success");
}).catch(error =>{
  //console.log(error);
});

pur_item.save().then(() =>{
  console.log("Purchase Item Success");
}).catch(error =>{
  //console.log(error);
});
*/


/*
Part 6
Reimplement the RESTful API using Sequelize and Express for your system.
*/
app.get('/', (req, res) => {
    let endpoints = '/users\n/products\n/purchases\n/purchase_items\n/products/:title\n/products/:id'
    res.send(endpoints);
});


app.get('/users', (req, res) => {
    User.findAll().then(users => {
        res.send(users);
        
      }).catch(err => {
        console.error(err);
    });
});


app.get('/purchases', (req, res) => {
    Purchase.findAll().then(purchases => {
        res.send(purchases);
        
      }).catch(err => {
        console.error(err);
    });
});


app.get('/purchase_items', (req, res) => {
    PurchaseItem.findAll().then(purchase_items => {
        res.send(purchase_items);
        
      }).catch(err => {
        console.error(err);
    });
});



app.get('/products', (req, res) => {
  //List all products
  Product.findAll().then(products => {
      res.send(products);
      
    }).catch(err => {
      console.error(err);
  });
});


app.get('/products/:id', (req, res) => {
    //GET /products/:id Show details of the specified products
    Product.findAll({
      where: {
        id: req.params.id
      }
    }).then(result =>{
      res.send(result);
    })
});

app.post('/products', (req, res) => {
    //POST /products Create a new product instance
    let _title = req.body.title;
    let _price = req.body.price;
    let _tags = req.body.tags;

    console.log(_title + ' ' + _price + ' ' + _tags);
    const prod = Product.build({title:_title.title,price:_price,tags:[_tags]})

    prod.save().then(()=>{
      let s = "Product: " + _title + " inserted successfully";
      console.log(s);
      res.send(s);
    }).catch(error =>{
      console.log(error);
    });
    
});

app.put('/products/:id', (req, res) => {
    //PUT /products/:id Update an existing product   
    console.log(req.params.id);

    
    Product.update(
        {
          title: req.body.title,
          price: req.body.price,
        },
        {where: {
          id:req.params.id}
        }
      )
      .then(rowsUpdated =>{
        res.send(rowsUpdated)
      })
      .catch(error =>{
        console.log(error);
      });
      
      
});

app.delete('/products/:id', (req, res) => {
    //DELETE /products/:id Remove an existing product 

    Product.destroy({
      where:{
        id: req.params.id
      }
    }).then(result =>{
      res.sendStatus(result);
    }).catch(error =>{
      res.send(error);
    })

});




app.listen(port, () => console.log('Example app listening on port ' + port))
