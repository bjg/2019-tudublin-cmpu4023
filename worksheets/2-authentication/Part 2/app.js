const express = require("express");
const http = require("http");
const massive = require("massive");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const connectionInfo = {
    host: "localhost",
    port: 5432,
    database: "kart"
};

massive({
    host: 'localhost',
    port: 5432,
    database: 'kart',
    user: 'postgres',
    password: '8myd!nner',
    ssl: false,
    poolSize: 10
  }).then(instance => {

    app.set("db", instance);

    //send post request to the products page
    //Token needs to be created & authenticated
    //timestamp needs to be created, authenticated and expire
    //callback function to be carried out asynchronously
    app.post('/api/login', (req,res) => {
        
        if(Object.keys(req.body).length === 0){
            res.redirect('/');
        }else{
            console.log(JSON.stringify(req.body));
            const uname = req.body.username;
            const pwd = req.body.password;

            instance.query(`select * from users where username = $1 and password = crypt($2,password);`,[uname,pwd])
            .then(user=>{
                console.log(JSON.stringify(user));
                if(Object.keys(user).length !==0){
                    // sign and send back token
                    jwt.sign({uname}, 'secretkey',{expiresIn: '24h'}, (err, token) => {
                        res.json({
                            user: users.username,
                            expires: '24h',
                            token
                        });
                    }).catch(err => console.log(err));
                }else if(users === undefined || users.length == 0){
                   res.status('404').json({
                       Status: 'Not found'
                   });
                }
            }).catch(err => console.log(err));
        }//end else
    });

app.get("/api/products/", verifyToken, (req, res) => {

    jwt.verify(req.token, 'secretkey', (err,authData) => {
        if(err){
            res.status(403).json({
                Status:"Forbidden"
            });
        }else{
            res.status(200).send("Successfully authenticated");
            req.app
            .get("db")
            .query("select * from products where id = $1", [req.params.id])
            .then(items => {
                res.status(200).json(items);
                res.json({
                    authData: authData,
                    products: products
                })
            })
            .catch(error => res.status(400).send(error));
        }//end else
    });
        
    });

    app.listen(3000,() => console.log('Server started on port 3000'));

});

// Authentication middleware for protected endpoints
function verifyToken(req, res, next) {
    
    //1 Get header value
    const bearerHeader = req.headers['authorization'];
    //check if bearer is undefined 
    if(typeof bearerHeader !== 'undefined'){
        //Split or parse at the space
        const bearer = bearerHeader.split('');
        //Get token from array 
        const bearerToken = bearer[1];
        //Set the token
        req.token = bearerToken;
        //Next middleware
        next();

    }else{
        //Forbidden
        res.sendStatus(403).json({
            Status: "Forbidden"
        });
    }
}


