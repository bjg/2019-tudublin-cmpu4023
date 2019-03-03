const express = require('express');
const http = require('http');
const massive = require('massive');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: false}));
router.use(bodyParser.json());
const app = express();

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'lab2',
  user: 'steve',
  password: 'q1W2e£R$',
  enhancedFunctions: true
}).then(instance => {
  app.set('db', instance);

  app.get('/', (req, res) => {
      res.send("Work sheet 2, C15446768");
  });

  //In postman once logged in get token, do post /products where authentication is
  //Select bearer token and past in token given then execute.
 app.post('/products', authenticate, (req, res) => {
    instance.query(
        "select * from products;"
    ).then(products => res.status(200).send(products))
  });

  function authenticate(req, res, next) {
    test = req.headers.authorization;

    // Removes first 7 characters and only recieves the token
    token = test.slice(7,);

    jwt.verify(token, 'supersecret', function (err, decoded){
      if(!err){
        //Returns back to where function was called
        next()
      }
      else{
        res.status(401).send("User not found")
      }
    })
    console.log("token: " + token);
}

  app.post('/users', (req,res) => {
    instance.query(
        "INSERT INTO users(username, password, public, secret) VALUES ('"
        +req.query.username+"', crypt('"
        +req.query.password+"', gen_salt('bf', 8)), 'test', 'supersecretkey');"
    ).then(users => {
        return res.json(users);
    })
    });

    // login to get the jwt token
  app.post("/login", function(req, res){
      var username = req.query.user;
      var password = req.query.pass;

      instance.query("select username, password from users where username = '"+ username+"' AND password = crypt('"+password+"', password);")
      .then(user => {
      if(user[0].username == username)
      {
        var token = jwt.sign({username: username}, 'supersecret',{expiresIn: 240});
        res.send(token);
        //res.redirect("/api?token="+token);
      }
      }).catch(err => console.log("Invalid Login"))  
  })

  

  //Requires a valid token to view product data
//   app.get('/api', function(req, res){
//   var token = req.query.token;
//   jwt.verify(token, 'supersecret', function(err, decoded){
//     if(!err){
//       instance.query(
//         "select * from users"
//     ).then(products => res.send(products))
//     } else {
//       res.send(err);
//     }
//   })
// })

  http.createServer(app).listen(3000,()=>{
    console.log("App is listening on http://127.0.0.1:3000");
});
});