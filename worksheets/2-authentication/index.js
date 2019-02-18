const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const massive = require('massive');

massive({
    host: 'localhost',
    port: 5432,
    database: 'enterprisedev',
    user: 'ronan',
    password: 'password',
    ssl: false,
    poolSize: 10
}).then(db => {

    app.get('/', (req, res) => {
      res.json({
        message: 'Hello World'
      });
    });
    
    
    app.get('/products', (req, res) => {
      db.products.find({},{}).then(products => {
        res.json(products);
      })
    });
    

    
    /*
    SELECT (hashed_password = crypt('johsword', hashed_password)) AS pswmatch FROM users where username = 'john';
    */
    app.post('/login', (req, res) => {
      console.log(req.body.username)
      
      db.query(
        `SELECT (hashed_password = crypt(${req.body.password}, hashed_password)) AS pswmatch FROM users WHERE username = ${req.body.username};`
        ).then(result => {
          if(result[0].pswmatch == false)
          {
            res.json({
              "message": "not authenticated"
            })
          }else{
            res.json({
              "message": "Success! authenticated"
            })
          }
        }).catch(error =>{
          res.json(error);
        });
        
    });
    
    
    app.get('/testdb', (req, res) => {
    
    });
});





app.listen(3000, () => console.log('Server started on port 3000'));