const express = require('express');
const massive = require('massive');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

massive(
  {
  host: 'localhost',
  port: 5432,
  database: 'lab2', 
  user: 'postgres',
  password: 'bramble',
  }
)
.then(db => {

  /* PART 1 
  > create extension pgcrypto;

  > User table created.
  > Instance of user i.e.:
  > INSERT INTO users (username,password)VALUES('franz',crypt('secret1234', gen_salt(‘bf’)));

  > Product table created.
  > Instance of product i.e.:
  > INSERT INTO products(name,price)VALUES('CD Album', 25);
  */


  /* PART 2 */

  app.post('/login', (req, res) => {

    let user = { 
      username: req.query.username,
      password: req.query.password  
    }

    if(user.username == null || user.password == null){
      res.status(401).json({status: res.statusCode, payload: "Enter a username/password"});
    }
    else
    {
      // Query to retrieve users
      db.query(
        'select * from users WHERE username = ${uname} AND password = crypt(${upass} , password);', {uname: user.username, upass: user.password}
      ).then(instance => {
        if( instance[0] != null){
          let token =jwt.sign(
            user,
            'secretkey',
            {expiresIn: "24h"}
          );

        res.json({
          success: true,
          token: token 
        });  
        } else{
            res.sendStatus(401)
        }
      });
    }
  })

  // Demonstration of JWT authentication on a protected resource
  app.get('/products', verifyToken, (req, res) => {    
     //Verify user token using the middleware function implemented below
    jwt.verify(req.token, 'secretkey', (err, authData) => {
      if(err){
        res.sendStatus(401)
      } else {
         db.products.find()
         .then(prod => res.json(prod));
       }
    })
  }) 

  /*
  PART 3
  160 bit: 1FEY5Nlr8BpaeOwfbZQR
  320 bit: 123977915eda185c2612b07698e7025391c29d0abbb1efc8b161b59c051384c2

  INSERT INTO users(username,password,accesskey,secretkey)VALUES(
  'julius',
  crypt('noble0815', gen_salt('bf')) ,
  '1FEY5Nlr8BpaeOwfbZQR','123977915eda185c2612b07698e7025391c29d0abbb1efc8b161b59c051384c2');
  */

  
  /* PART 4 */ 
  app.post('/hmacproducts', function(req,res){
    let signature = req.headers.signature;
    let accesskey = req.headers.access;
    let bodymsg = req.body.message;

    db.query("select secretkey from users where accesskey ='" + accesskey + "';")
      .then( instance => {
        let secretKey = instance[0].secretkey;
        let hmac = crypto.createHmac('SHA256',secretKey).update(bodymsg).digest('hex');
        // console.log(hmac);

        if(signature === hmac)
        {
          db.query("INSERT INTO products(name, price) VALUES (${prodname}, ${prodprice})", {prodname: req.body.name, prodprice: req.body.price})
            .then( () =>{
              res.status(200).json({status: res.statusCode, payload:"Product inserted."});
            })
          .catch(() => {
            return  res.status(401).json({status: res.statusCode, payload: "Product description not found."});
          })
        }else {
          return res.status(401).json({status: res.statusCode, payload: "Message inside body not found."});
        }
      })
  });

// Demonstrating HMAC authentication on a protected resource
app.get('/hmacproducts', function(req,res){
  let accesskey = req.headers.access;
  if(accesskey == undefined){
    return  res.status(401).json({status: res.statusCode, reason:res.statusMessage});
  }else{
    db.query("SELECT * from products")
    .then(items =>{
        res.status(200).json({status: res.statusCode, payload: items});
      })
    }
});



}); // end massive database


//Middleware function to verify tokens
function verifyToken(req,res,next){
  const bearerHeader = req.headers.authorization

  if(typeof bearerHeader !== null){
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      req.token = bearerToken
      next()

  } else{
      res.sendStatus(403)
  }
}

app.listen(port, () => console.log(`JWT and HMAC on port ${port}!`))
