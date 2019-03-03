const express = require('express');
const http = require('http');
const massive = require('massive');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: false}));
router.use(bodyParser.json());

const username1 = "gary";
const password1 = "test1234";

const app = express();

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'freshdb',
  user: 'postgres',
  password: 'test1234',
  enhancedFunctions: true
}).then(instance => {
  app.set('db', instance);

  app.get('/', (req, res) => {
      res.send("Worksheet 2 testing :(");
  });


 // Products table calling authenticate 
 app.post('/products', authenticate, (req, res) => {
    instance.query(
        "select * from products;"
    ).then(users => res.status(200).send("Successfully authenticated"))
  //).then(users => res.json(users))
  });

  //inserting users into the database
  app.post('/users', (req,res) => {
    instance.query(
        "INSERT INTO users(username, password, access_key, secret_key) VALUES ('"
        +req.query.username+"', crypt('"
        +req.query.password+"', gen_salt('bf', 8)), 'helloworld', 'supersecretkey');"
    ).then(users => {
        return res.json(users);
    })
    });
  
  // app.get('/token', function(req, res){
  //     var token = jwt.sign({username:"gary"}, 'supersecret',{expiresIn: 240});
  //     res.send(token)
  //   })


  //calling the login and passing in a users details
  app.post("/login", function(req, res){
      var username = req.query.username;
      var password = req.query.password;

      var check = instance.query("select username, password from users where username = '"+req.query.username+"' AND password = crypt('"+req.query.password+"', password);")
      .then(user => {

      if(user[0].username == username)
      {
        var token = jwt.sign({username: username}, 'supersecret',{expiresIn: 240});
        res.send(token);
        //res.redirect("/api?token="+token);
      }
      // else {
      //   res.send("Wrong Username");
      // }

      }).catch(err => console.log("Invalid Login"))  
  })

  function authenticate(req, res, next) {

      //console.log(req.headers);
      header = req.headers.authorization;

      token = header.slice(7,);

      jwt.verify(token, 'supersecret', function (err, decoded){
        if(!err){
          next()
        }
        else{
          res.status(401).send("User not found")
        }
      })
      console.log(token);
  }

//   // Register a route that requires a valid token to view data
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
