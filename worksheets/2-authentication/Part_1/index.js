/*Worksheet 2 - AUTHENTICATION
*PART 1 - Hashed Passwords
*Submitted By: Dimiter Dinkov
*Student Number: c15334276
* */

//require some modules
const path = require('path');
const bodyParser = require("body-parser");
const express = require('express');
const app = express();
const massive = require('massive');

//CONSTATN VARIABLES
const SECRET = "secret-keyword";
const TWO_HOURS = 1000*60*60*2;
//Environmental variables
const {
    NODE_ENV = "development",
    EXPIRATION=TWO_HOURS,
    SESSION_NAME = 'ssid'
} = process.env;
const IN_PRODUCTION = NODE_ENV === "production";

//setting up the views engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//Set up body parser so we can extract data from the body of http request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//create a session object which creates a session cookie once the user is logged in
const session = require('express-session');
app.use(session({
    name : SESSION_NAME,
    secret : SECRET,
    resave: false,
    saveUninitialized : false,
    cookie:{
        maxAge: EXPIRATION,
        sameSite:true,
        secure:IN_PRODUCTION,
    }
}));

//User Authentication based on session
const authenticateUser = (req,res,next) =>{
    if(req.session.userID){
       next();
    }else{
        res.redirect('/');
    }
};

//Middle ware to keep a user that already logged in from trying to log in again
const userLoggedIn = (req,res,next)=>{
    if(req.session.userID){
        res.redirect('/products');
    }else{
        next();
    }
};

//connect to psql db
massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'worksheet2',
    user: 'postgres',
    password:'mitkodi123',
    ssl: false,
    poolSize: 10
}).then(instance => {
    //Home route - renders login page
    app.get('/', userLoggedIn, (req, res) => {
        res.render('login');
    });
    //intermediate login route - authenticates the user and creates a session
    app.post('/login',userLoggedIn,(req,res)=>{
        const username = req.body.username;
        const password = req.body.password;
        //look for a user with matching username and password
        instance.query(`select * from users where username = $1 AND password = crypt($2,password)`,[username,password])
            .then(user => {
                if(Object.keys(user).length !== 0) { //If the user is found create a session
                    req.session.userID = username;
                    res.redirect('/products');
                }else{
                    res.redirect('/');//If the user is not found redirect to home route
                }
        }).catch(error =>{
            console.log(error); //Log errors
        });
    });
    //Protected page that can only be accessed if a user is logged in
    app.get('/products',authenticateUser,(req,res) =>{
        //Display a list of all products
        instance.query("Select * from products")
            .then(products=>{res.json(products)})
            .catch(error=>console.log(error));
    })
});
//Configure app to listen on port 3000
app.listen(3000, () => console.log("http://127.0.0.1:3000"));