const express = require('express')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const port = 3001
const massive = require('massive');
const jwt = require('jsonwebtoken');
const middleware = require('./check-auth');
const config = require('./config.js');
massive({
  host: 'localhost',
  port: 5432,
  database: 'lab2',
  user: 'myuser',
  password: 'mypass'
}).then(db => {
    app.post('/login', (request, response) => {
        var uname = request.body.name;
        var upass = request.body.pass;
        db.query(
          //To avoid SQL injection we can use a stored procedure previously created on Postgres
           'SELECT * FROM login ( \'' + uname +  '\',\''+ upass  +  '\')'
        ).then(user => {
            if( user[0] !=null){
                // response.json("Welcome "+user[0]['name'] +" your id is: "+ user[0].id);
                  let token =jwt.sign({ _id:user[0].id},
                    config.secret,
                    {expiresIn: "24h"}// the following token expires in 24 h
                  );
                // return the JWT token for the future API calls
                response.json({
                  success: true,
                  message:"Auth succesful",
                  token: token//displaying token
                });  
            }else{
                response.json("Login incorrect");
            }
        });

    })
    // This is a protected resource. 
    // The products endpoint uses a middleware script that verifies if the token is valid
    app.get('/products',middleware.checkToken, (request, response) => {    
        db.products.find({}).then(user => response.json(user));
    })
});


app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// CREATE DATABASE lab2;
// CREATE EXTENSION pgcrypto;
// CREATE TABLE users (    
//     id int NOT null,
//     name text NOT NULL,
//     password text NOT NULL
// );

// When we add new users to our table, we use the crypt function. The first parameter is the user’s password.
// The second is the gen_salt function. This generates the salt for our password, and also tells the crypt function 
// which hashing algorithm to use.Here, we use 8 iterations of the Blowfish ('bf') algorithm:

// INSERT INTO users (id,name, password) VALUES (1,'dave', crypt('password1', gen_salt('bf', 8)));
// SELECT * FROM users WHERE 
//     name='dave' AND 
//     password = crypt('password1', password);

// INSERT INTO products (id, name, description,price) VALUES 
// (1, 'Macbook Pro','13inches retina display','1899'),
// (2, 'Asus laptop','13inches','1500'),
// (3, 'Dell Alienware Graphics Amplifier','Gaming without sacrifice','207.66 ');

//Stored procedure
// CREATE OR REPLACE FUNCTION login(_username TEXT, _password TEXT)
// RETURNS setof users AS
// $BODY$
// BEGIN 
// RETURN QUERY
// SELECT *
// FROM users 
// WHERE name = _username
// AND password = crypt(_password, password);
// END;
// $BODY$
// LANGUAGE plpgsql;