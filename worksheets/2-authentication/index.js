const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
var CryptoJS = require("crypto-js");


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
    
    
    // Protected Route
    app.post('/products', checkToken,(req, res) => {
      jwt.verify(req.token,'secretkey',(error, authen_data)=>{
        if(error){
          res.sendStatus('403');
        }else{
          db.products.find({},{}).then(product_list => {
            res.json({
              products: product_list,
              authen_data: authen_data
            });
          })
        }
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

    app.post('/hmac', (req, res) => {

      var secret_key = "RBvzglECUaxf7aTCWKUtHbAhNhmsamo+4kCQzGL+Fgw=";
      //public key: d5f89c73d8c642b187c5ded06b560e5b
      
      let access_token = req.headers.hmac;
      let payload = req.headers.payload;

      let server_hash = CryptoJS.HmacSHA256(payload,secret_key);
      console.log("server_hash: " +  server_hash);

      if(access_token == server_hash){
        //TODO access protected resource
        console.log(req.headers.payload);
        console.log("Match");
        res.send("Success!");
      }
      else{
        res.send("Not authenticated");
      }
    });
  
    app.post('/create_keys',(req,res) =>{
      let access_key = req.headers.access_key;
      let access_hash = CryptoJS.SHA1(access_key);
      let base64_access_key = CryptoJS.enc.Base64.stringify(access_hash);
      console.log(base64_access_key);

      let secret_key = req.headers.secret_key;
      let secret_hash = CryptoJS.SHA256(secret_key);
      let base64_secret_key = CryptoJS.enc.Base64.stringify(secret_hash);
      console.log(base64_secret_key);

      //typo in table acccess_key!
      db.query(
        `INSERT INTO api_keys (acccess_key,secretkey) VALUES ('${base64_access_key}','${base64_secret_key}');`
        ).then(result => {
          console.log(result);
          res.send("Success!");
        }).catch(error =>{
          console.log(error);
          res.send("Error");
        });
      
    })


    function mockClient(){
      //CLIENT: used to generate a hash 
      let secret_key = "RBvzglECUaxf7aTCWKUtHbAhNhmsamo+4kCQzGL+Fgw=";
      let public_key = "d5f89c73d8c642b187c5ded06b560e5b";

      //product to be inserted
      let obj = '{"name":"Fender Precision","description":"Bass Guitar","price":"500.00"}';
      let payload = obj;
      //console.log("payload: " + payload);

      //Hash it 
      let client_payload_hash = CryptoJS.HmacSHA256(payload,secret_key).toString();
      console.log("client_payload_hash: " + client_payload_hash);


    }
});





app.listen(3000, () => console.log('Server started on port 3000'));