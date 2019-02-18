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
        message: Math.floor(Date.now() / 1000) + ((60 * 60) * 24)
      });
    });
    
    
    app.post('/products', checkToken,(req, res) => {
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
            jwt.sign(
              {
                user:req.body.username,
                exp: Math.floor(Date.now() / 1000) + ((60 * 60) * 24)
              },'secretkey',(error,token) =>{
              res.json({
                token: token
              })
            })
          }
        }).catch(error =>{
          res.json(error);
        });
        
    });

    function checkToken(req,res,next){
      //authentication header val
      const bearer_header = req.headers['authorization'];
      if(typeof bearer_header !== 'undefined'){
        const bearer_array = bearer_header.split(" ");
        const bearer_token = bearer_array[1];  
        req.token = bearer_token;
        next();   
      }
      else{
        res.sendStatus(403);
      }

    }
    
    
    app.get('/testdb', (req, res) => {
    
    });
});





app.listen(3000, () => console.log('Server started on port 3000'));