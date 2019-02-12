const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const massive = require('massive');

massive({
  host: 'localhost',
  port: 5432,
  database: 'pgguide',
  user: 'postgres',
  password: '8myd!nner',
  ssl: false,
  poolSize: 10
}).then(instance => {
    app.set('db',instance);
//Question 1

    //List all users email and sex in order of most recently created. Do not include password hash in your output
    app.get('/users', (req,res) => {
        instance.query('SELECT email, details FROM users ORDER BY created_at DESC').then(users => res.send(users));
    });

    //Show above details of the specified user
    app.get('/users/:id', (req,res) => {
        instance.query(`SELECT * FROM users WHERE id = ${req.params.id}`).then(users => res.send(users));
    });
    

    //List all products in ascending order of price
    app.get('/products', (req,res) => {
        instance.query('SELECT * FROM products ORDER BY price DESC').then(users => res.send(users));
    });

    //Show details of the specified products
    app.get('/products/:id', (req,res) => {
        instance.query(`SELECT * FROM products WHERE id = ${req.params.id}`).then(users => res.send(users));
    });
    

    //List purchase items to include the receiver’s name and, address, the purchaser’s email address and the price, 
    //quantity and delivery status of the purchased item. Order by price in descending order
    app.get('/users/purchases', (req,res) => {
        instance.query('SELECT p.price, p.quantity, p.state FROM purchase_items p INNER JOIN').then(users => res.send(users));
    });
});