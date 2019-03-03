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

//create a session object which creates a session cookie once the user is logged in.rs
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

const userLoggedIn = (req,res,next)=>{
    if(req.session.userID){
        res.redirect('/products');
    }else{
        next();
    }
};

massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'worksheet2',
    user: 'postgres',
    password:'mitkodi123',
    ssl: false,
    poolSize: 10
}).then(instance => {
    app.get('/', (req, res) => {
        res.render('login');
    });
    app.post('/login',userLoggedIn,(req,res)=>{
        const username = req.body.username;
        const password = req.body.password;

        instance.query(`select * from users where username = $1 AND password = crypt($2,password)`,[username,password])
            .then(user => {
                if(Object.keys(user).length !== 0) {
                    req.session.userID = username;
                    console.log(req.session);
                    res.redirect('/products');
                }else{
                    res.redirect('/');
                }
        }).catch(error =>{
            console.log(error);
        });
    });
    app.get('/products',authenticateUser,(req,res) =>{
        instance.query("Select * from products")
            .then(products=>{res.json(products)})
            .catch(error=>console.log(error));
    })
});

app.listen(3000, () => console.log("http://127.0.0.1:3000"));