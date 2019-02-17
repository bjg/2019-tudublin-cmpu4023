const express = require('express');
const app = express();
app.listen(3000);
//const port = 5432;
const massive = require('massive');
//const monitor = require('pg-monitor');
massive
(
    {
	    host: 'localhost',
        port: 5432,
        database: 'pgguide',
        user: 'katie',
        password: 'katie',
        enhancedFunctions: true
    }
).then(instance =>{db = instance;});
//massive('//postgres:localhost:5432/pgguide').then(db => {monitor.attach(db.driverConfig);
//Quesion One
//Part One
  app.get('/users', (req, res) => {
    db.users.find({},{
            fields: ["email", "details::json"],
            order: [{
                field:'created_at', 
                direction: 'desc',
            }]
    }).then(x => {
        res.json(x);
    })       
});

  //db.users.find({
  //}, {fields: ['email', 'details'] }).then(res => {console.log(res)});

  //Part Two
  app.get('/users/:id', (req, res) => {
    db.users.findOne(req.params.id,
    {
            fields: ["email", "details::json"]
    }).then(x => {
        res.json(x);
    })      
});


   //db.users.find({
  //  id: 3
  //}, {fields: ['email', 'details'] }).then(res => {console.log(res)});

  //Part Three
  app.get('/products', (req, res) => {
    if(req.query.name == undefined)
    {
        db.products.find({},{
            order: [{
                field:'price', 
                direction: 'asc',
            }]
        })
    .then(x => {
        res.json(x);
        });        
    }
  //db.products.find({
    //}, {fields: ['title', 'price'], order:[{field: 'price', direction: 'asc', types: 'int'}] }).then(res => {console.log(res)});
});

  //Part Four 
  app.get('/products/:id', (req, res) => {
    db.products.findOne(req.params.id,
    {}).then(x => {
        res.json(x);
    })       
});

  //db.products.find({
  //  id: 4
  //}, {fields: ['title', 'price'], order:[{field: 'price', direction: 'asc', types: 'int'}] }).then(res => {console.log(res)});

  //Part Five
  app.get('/purchases', (req, res) => {
    db.query(
        `select purchase_items.price, purchase_items.quantity, purchase_items.state, purchases.name AS RECEIVER_NAME, purchases.address AS RECEIVER_ADDRESS, users.email AS PURCHASERS_EMAIL from purchase_items INNER JOIN PURCHASES ON (purchase_items.purchase_id=purchases.id) INNER JOIN USERS ON (purchases.user_id=users.id) ORDER BY price DESC;`,{
        }).then(x => {
        res.json(x);
      });
  });

  //Question Two
    app.get('/products', (req, res) => {
      if(req.query.name == undefined)
      {
          db.products.find({},{
              order: [{
                  field:'price', 
                  direction: 'asc',
              }]
          })
      .then(x => {
          res.json(x);
          });        
      }
      /*else{db.query("select * from products where title = '" + req.query.name +"';")
                .then(x => {
                   res.json(x);
               });
           }
       });

      //Question Three 
      //Part One
   else{
    db.get_products(req.query.name)
   .then(x => {
       console.log(x.json)
       res.send(x);
   })
   }
  });*/
      //Part Two
      else{
                 db.query("select * from products where title = ${name}", {name: req.query.name})
                 .then(x => {
                     res.json(x);
                 })
             }
  });




  /** db.products.find({title: '$name'}, {fields: ['title', 'price'], order:[{field: 'price', direction: 'asc', types: 'int'}] }).then(res => {console.log(res)});

  db.products.where({title: '$name'}, {fields: ['title', 'price'], order:[{field: 'price', direction: 'asc', types: 'int'}] }).then(res => {console.log(res)});
  db.products.where("title=&name",[name], function(err, products){});
  db.query('SELECT * FROM products WHERE title = title', function(err,res){}).then(res => {console.log(res)});

  db.products.where('title IN (SELECT ?title FROM products)').then(res => {console.log(res)});
  db.query(select * from "products" where title= ($1), function(err,res){}).then(res => {console.log(res)});

  db.get_products(function(err, products) {}).then(res => {console.log(res)});
//});


massive.connect({
  connectionString: "postgres:localhost/pgguide"}, function(err, db) {
  //products_in_stock may be either a function on the database or a SQL file in /db
  db.get_products(function(err, products) {}).then(res => {console.log(res)});
});*/

/** 
 * select purchase_items.price, purchase_items.quantity, purchase_items.state, 
  purchases.name AS RECEIVER_NAME, purchases.address AS RECEIVER_ADDRESS, 
  users.email AS PURCHASERS_EMAIL from purchase_items INNER JOIN PURCHASES ON 
  (purchase_items.purchase_id=purchases.id) INNER JOIN USERS ON (purchases.user_id=users.id) 
  ORDER BY price DESC
 */
  //db.query('select purchase_items.price, purchase_items.quantity, purchase_items.state, 
  //purchases.name AS RECEIVER_NAME, purchases.address AS RECEIVER_ADDRESS, 
  //users.email AS PURCHASERS_EMAIL from purchase_items INNER JOIN PURCHASES ON 
  //(purchase_items.purchase_id=purchases.id) INNER JOIN USERS ON (purchases.user_id=users.id) 
  //ORDER BY price DESC', function(err,res){
  //}).then(res => {console.log(res)});
