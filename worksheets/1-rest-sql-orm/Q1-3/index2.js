const express = require('express');
const http = require('http');
const massive = require('massive');
port = 3000;

const app = express();

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'pgguide',
  user: 'postgres',
  password: '12ambionG'
}).then(instance => {
  app.set('db', instance);

  //QUESTION 1

  //1.1 List all users email and sex in order of most recently created. Do not include password hash in your output
  app.get('/users', async(req, res) => {
	  const users = await req.app.get('db').query('select email,details -> \'sex\' as sex from users ORDER BY created_at DESC;');
	  res.json(users);
  });
  
  //1.2 Show above details of the specified user
  app.get('/users/:id', async(req, res) => {
    //const id = req.params.id;
	  const users = await req.app.get('db').query('select email,details -> \'sex\' as sex from users where id = ${id} ORDER BY created_at desc;', {
            id: req.params.id,
        });
    res.json(users);
  });

  //1.3 List all products in ascending order of price
  app.get('/products',async(req, res) => {
    const result = await req.app.get('db').query("select * from products ORDER BY created_at ASC")
    res.json(result);
  });

  //1.4 Show details of the specified products
  app.get('/products/:id', async(req, res) => {
    const products = await req.app.get('db').products.findOne({ 'id =': req.params.id }).then(products => {
            res.json(products);
        });
  });

  //1.5 List purchase items to include the receiver’s name and, address, the purchaser’s email address and the price, quantity and delivery status of the purchased item. Order by price in descending order
  app.get('/purchases', async(req, res) => {
    const purchases = await req.app.get('db').query('select purchases.name, purchases.address, purchase_items.price, purchase_items.quantity, users.email from purchases INNER JOIN purchase_items ON purchases.id=purchase_items.purchase_id INNER JOIN users ON purchases.user_id=users.id ORDER BY price DESC;');
    res.json(purchases);
  });
  
  //q2 poorly implemented  http://localhost:3000/productspoor?name=Water'; DELETE FROM purchase_items WHERE product_id = 25; DELETE FROM products WHERE title = 'Water';
  app.get('/productspoor',async(req, res) => {
    //const name = req.query.name;
	  const result = await req.app.get('db').query("select * from products where title='" + req.query.name + "'");
	  res.json(result);
  });

  //q3
  //paramatised https://massive-js.readthedocs.io/en/v2/simple_queries/
  //http://localhost:3000/productsfix?name=Dictionary'; DELETE FROM purchase_items WHERE product_id = 2; DELETE FROM products WHERE title = 'Dictionary';
  app.get('/productsfix',async(req, res) => {
    const result = await req.app.get('db').query('select * from products where title = ${name}' ,{name : req.query.name});
    res.json(result);
  });
  
  app.get('/productstored',async(req, res) => {
    //const result = await req.app.get('db').get_products(req.query.name);
    //res.json(result);
    app.get('db').get_products(req.query.name).then(product => {
      res.send(product);
      })
  });

  app.listen(port, () => console.log('Example app listening on port ${port}!'));
});