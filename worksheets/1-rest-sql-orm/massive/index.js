const express = require('express')
const app = express()
// var sqlinjection = require('sql-injection');
// app.use(sqlinjection);
const port = 3001
const massive = require('massive');

massive({
  host: 'localhost',
  port: 5432,
  database: 'pgguide',
  user: 'myuser',
  password: 'mypass'
}).then(db => {
  
    app.get('/users', (request, response) => {
        //List all users email and sex in order of most recently created. Do not include password hash in your output
        db.users.find({},{
            fields: ['email', 'details'],
            exprs: {details: "details::json->>'sex'"},
            order:[{field : 'created_at',
            direction: 'asc', nulls: 'first'}]}).then(user => response.json(user));

    })
    app.get('/users/:id', (req, response) => {
        //List all users email and sex in order of most recently created. Do not include password hash in your output
        var uid = Number(req.params.id);
        db.users.find({id:uid},{
            fields: ['email', 'details'],
            exprs: {details: "details::json->>'sex'"},
            order:[{field : 'created_at',
            direction: 'asc', nulls: 'first'}]}).then(user => response.json(user));
    })
    app.get('/products', (request, response) => {
        //List all products in ascending order of price
        db.products.find({},{order:[{field : 'price',direction: 'asc', nulls: 'first'}]}).then(p => response.json(p));
    })
    app.get('/products/:id', (req, response) => {
        //Show details of the specified products
        var pid = Number(req.params.id);
        db.products.find({id:pid},{order:[{field : 'price',direction: 'desc', nulls: 'first'}]}).then(p => response.json(p));
    })
    /*List purchase items to include the receiver’s name and, address, 
    the purchaser’s email address and the price, quantity and delivery status of the purchased item. 
    Order by price in descending order */
   app.get('/purchases', (req, res) => {
    db.query(
        'SELECT P.NAME,P.ADDRESS,U.EMAIL,PI.PRICE,PI.QUANTITY,PI.STATE FROM PURCHASE_ITEMS PI JOIN PURCHASES P ON (PI.PURCHASE_ID = P.ID) JOIN PRODUCTS PR ON (PI.PRODUCT_ID = PR.ID) JOIN USERS U ON (P.USER_ID = U.ID) ORDER BY PI.PRICE DESC'
    ).then(product => res.json(product));
    })
      
    //Bad implementation SQL Injection: ?name=Coloring Book';drop table products; --'
    //http://localhost:3006/bad?name=Coloring Book';drop table products; --'
    app.get('/bad', (req, res) => {
        db.query( 
            'select * from products where title LIKE \'' + req.query.name + '\''
        ).then(product => res.json(product));
    })
    //Parametrised query
    app.get('/find_product', (req, response) => {
        var pname = req.query.name;
        // db.products.find({title:name}).then(p => response.json(p));
        db.query(
            'SELECT * FROM PRODUCTS WHERE TITLE LIKE ${name}',
            {name:pname}
        ).then(product => response.json(product));
    })
    //Stored procedure
// CREATE OR REPLACE FUNCTION getProduct(_title TEXT)
// RETURNS setof products AS
// $BODY$
// BEGIN 
// RETURN QUERY
// select * from products where title = _title;
// END;
// $BODY$
// LANGUAGE plpgsql;
    
//SELECT * FROM  getProduct('Laptop Computer'); 
//Stored procedure
    app.get('/procedure', (req, res) => {
        db.query( 
            'select * from getProduct ( \'' + req.query.name + '\')'
        ).then(product => res.json(product));
    })
});



app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })
app.listen(port, () => console.log(`Example app listening on port ${port}!`))