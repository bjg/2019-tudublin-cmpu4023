/*Worksheet 2 - AUTHENTICATION
*   PART 2 - JSON Web Tokens
*   Submitted By: Dimiter Dinkov
*   Student Number: c15334276
* I MIGHT HAVE OVERCOMPLICATED THIS A BIT
* */

//environmental variables
const {
    PORT = 3000,
    SESSION_NAME = 'ssn',
    COOKIE_EXPIRATION = 1000 * 60 * 10,
} = process.env;
//secret keyword to encode the session object
const SECRET = 'session-secret';
//Store the key for signing tokens outside of environmental variables
const JWTKEY = "secret-keyword";

const express = require("express"); //express
const app = express();//initialise express app
const massive = require("massive");//require massive.js framework to connect to psql
const bp = require("body-parser");//body parser to handle body of http requests
const path = require("path");
const jwt = require("jsonwebtoken");//JSON Web Token
const session = require("express-session");//express session to initialise session objects


//configure the session object
app.use(session({
    name: SESSION_NAME,
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { //Configure the cookie that will store the session ID
        maxAge: COOKIE_EXPIRATION, //Cookie will expire after 10 mins
        sameSite: true,
        secure: false //Set to secure as this is a HTTP and not a HTTPS server
    }
}));

//Configure the view-engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
//configure boyd-parser
app.use(bp.json());
app.use(bp.urlencoded({extends: false}));

const config = {
    host: "127.0.0.1",
    port: 5432,
    database: "worksheet2",
    user: "postgres",
    ssl: false,
    poolSize: 10,
    password: "mitkodi123"
};
//Configre massive so it connects to the database
massive(config).then(db => {
    //Home route - Loads Login page
    app.get("/", (req, res, next) => {
        res.render("login");
    });
    //Redirect for the user's login authentication
    app.post("/login", (req, res, next) => {
        //get the username and password that is being posted
        const username = req.body.username;
        const password = req.body.password;
        //Check if a user with the username and corresponding password exists
        //return a user object if  the user is found
        db.query("SELECT * FROM USERS WHERE USERNAME = $1 AND PASSWORD = crypt($2,PASSWORD)", [username, password]).then(user => {
            //Check if the user exists
            if (Object.keys(user) === 0) {
                //If the user is does not exist return 401 error
                res.json({
                    message: "User Not Found",
                    statusCode: 401
                });
            } else {
                //sign a jwt with the user which expires after 24 hours
                jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),//set token to expire after 24 hours
                    user //user object
                }, JWTKEY, (err, token) => {
                    //Create a session
                    req.session.token = token;
                    req.session.userID = username;
                    //Redirect the user to the products page
                    res.redirect(`/products`);
                })
            }
        }).catch(error => console.log(error));
    });
    //Products page displays a list of all the products available
    //Middle ware authenticateToken function checks if a token exists and if it was created for this user
    app.get("/products", authenticateToken, (req, res, next) => {
        db.query("Select * from products").then(products => {
            res.json({
                products
            })
        }).catch(err => {
            console.log(err);
        })
    });
}).catch(error => console.log(error));

//Functions to authenticate the JWT token and user
// Checks if a session is already made and if it has, then the user is allowed to the /products route
//If the session is not made, it extracts the authorization token from the header fields and verifies it
//ALSO Works with postman and similar API querying tools and extracts token from header field
const authenticateToken = (req, res, next) => {
    //if a session already exists then just let the user through, otherwise create the session
    if (typeof req.session.token !== 'undefined' && typeof req.session.userID !== 'undefined') {
        jwt.verify(req.session.token, JWTKEY, (err, userAuth) => {
            if (err) {
                res.json({
                    status: 401,
                    message: "Error occured when trying to verify the token"
                });
            } else {
                next();
            }
        });
    } else {
        //check if header fields exists and if they dont then redirect the user to login
        if (typeof req.headers['Authorization'] === 'undefined' || typeof req.headers['userID'] === 'undefined') {
            res.redirect('/');
        } else {
            //extract the bearer token and the username
            const bearerHeader = req.headers['Authorization'];
            const userHeader = req.headers['User'];
            //split the bearer header into an array so you can extract just the token
            const bearer = bearerHeader.split(" ");
            //extract the token from the array
            const token = bearer[1];
            //check if the token and userID exist
            if (typeof token === 'undefined' || typeof userHeader === 'undefined') {
                res.json({
                    status: 401,
                    message: 'Token not found'
                });
            } else {
                //if the token and userID exist verify that the token was made for this user
                jwt.verify(token, JWTKEY, (err, userAuth) => {
                    if (err) {
                        res.json({
                            status: 401,
                            message: "Error occured when trying to verify the token"
                        });
                    } else {
                        //if the username that as extracted from the token is the same as the userID then create a session
                        if (userAuth.user[0].username === userHeader) {
                            req.session.token = token;
                            req.session.userID = userHeader;
                            next();
                        } else {
                            res.json({
                                status: 401,
                                message: "Token was not signed by the same user"
                            })
                        }
                    }
                })
            }
        }
    }
};
app.listen(PORT, () => console.log("http://127.0.0.1:3000"));

/*
//REALLY SIMPLIFIED VERSION OF THE APP ABOVE
//modules
const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const massive = require('massive');
const config = {
    host:"127.0.0.1",
    port:5432,
    user: 'postgres',
    database: 'worksheet2',
    ssl:false,
    poolSize: 10,
    password:'mitkodi123'
};
const user ={
    userID:1,
    username:'matew',
    password:'hello'
};


app.get('/',(req,res)=>{
    res.send("Hello world");
});
app.get('/getToken',(req,res)=>{
    jwt.sign({
        exp:Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        user
    },'secret-key',(err,token)=>{
        console.log(token);
        res.redirect(`/protected?token=${token}`);
    })
});
app.get('/protected',verifyToken,(req,res)=>{
    res.send('Welcome to protected page');
});


const verifyToken= (req,res,next)=>{
    const token = req.query.token;
    jwt.verify(token,'secret-key',(err,UserData)=>{
        if(err === null){
            next();
        }else{
            res.sendStatus(401);
        }
    });
};

app.listen(3000,console.log("http://127.0.0.1:3000"));

*/