const express = require('express')
const massive = require('massive');

const app = express()
const port = 3000
const promise = require('bluebird')

massive({ 
  host: 'localhost',
  port: 5432,
  database: 'pgguide',
  user: 'postgres',
  password: 'bramble',
  ssl: false,
  poolSize: 10,
  promiseLib: promise
}).then(instance => {
    app.set("db", instance);

    app.get('/', (req, res) => res.send('Hello World!'));


    
    /*  PROBLEM SET 1   */ 

    app.get('/users', async (req, res) => {
      const query = await req.app.get('db').query('SELECT email, details -> \'sex\' AS sex FROM users;');
      res.json(query);
    });

    app.get('/users/:id', async (req, res) => {
      const u_id = parseInt(req.params.id)
      const query = await req.app.get('db').query('SELECT email, details, created_at FROM users WHERE id = ' + u_id + ';');
      res.json(query);
    });

    app.get('/products', async (req, res) => {
      const u_id = parseInt(req.params.id)
      const query = await req.app.get('db').query('SELECT title, price FROM products ORDER BY PRICE;');
      res.json(query);
    });
       
    app.get('/products/:id', async (req, res) => {
      const p_id = parseInt(req.params.id)
      const query = await req.app.get('db').query('SELECT title, price, created_at FROM products WHERE id = ' + p_id + ';');
      res.json(query);
    });

    app.get('/purchases', async (req, res) => {
      const query = await req.app.get('db').query(`
      SELECT 
      name, 
      address,
      price, 
      quantity, 
      purchase_items.state 
      FROM purchases
      INNER JOIN purchase_items ON purchases.id = purchase_items.purchase_id 
      ORDER BY price DESC;`);
      res.json(query);
    });


    /*  PROBLEM SET 2   */ 

   app.get('/sqlinject/products', async (req, res) => {
        const q_name = req.query.name;
        const query = await req.app.get('db').query("SELECT * FROM products WHERE title='" + q_name + "'");
        res.json(query);
   }); // for sql injection:  http://localhost:3000/sqlinject/products?name=Coloring Book' or title = 'Baby Book 


    /*  PROBLEM SET 3  */ 
   app.get('/secured/products', async (req, res) => {
    //  if(req.query.name == undefined) { 
    const result = await req.app.get('db').query('select * from products where title = ${name};', {
        name: req.query.name,
    });
    res.json(result);
    
  // }  // else { // stored procedure 
  //   storedproc(req.query.name)
  //   .then(products => {
  //     res.send(products);
  //   })
  // }
 }); // attempt of sql injection will be invalid


    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});


