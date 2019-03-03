

const express = require('express');
const jwt = require('jsonwebtoken');
const massive = require('massive');
http = require("http");
crypto = require("crypto");
var HmacAuth = require('hmac-authentication');
const app = express();
const port = 3000

//listening on port
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//Post gres database caled newdatabase
massive({
	host: '127.0.0.1',
	port: 5432,
	database: 'newdatabase',
	user: 'ashleyfitzgerald',
	password: 'ashleymark'
}).then(db =>{
	app.set('db', db);
})


/**************************
   Generating JWT 
   checks for username and password in database and if authenticated, JWS toke is generated

  note: in the user table the password field was hashed using gensalt and crypt
 **************************/
 
 //route that includes username and password
app.post('/login/:username/:password',(req,res) => {
    var UserName= req.params.username;
    var Password=req.params.password;

    //get user from user table
    app.get('db').query("SELECT * FROM users WHERE username='"+UserName+"' AND password=crypt('"+Password+"', password)").then(user=> {
        console.log(user[0]);
        console.log(typeof(user[0]))
        //if user array is empty produce nd error
        if(user[0] == undefined)
        {   
                //send error messageto user 
                res.send("ERROR! User credentials not authenticated!");
        }

        //If the users credentials match to the database, generate the JWT
        else{
             jwt.sign({UserName},'secretkey',{expiresIn: '1 Day'},(err,token) => {
                res.json({token})
             });
        }//end else  
    });
});  


//this is the protected route that can only be accesssed with the Json web token 
app.post('/products',verifyToken,(req,res) => { 
    jwt.verify(req.token, 'secretkey',(err, authData) =>{
        if(err){
            res.sendStatus(401);
        }
        else{ res.json({
                message: 'Access',
                authData,  
            }); 
            app.get('db').query("SELECT * FROM products").then(products=> {
                console.log(products);
            })
    }
    });  
});

//FORMAT OF TOKEN 
//Authorization : Bearer <access_token> 
//verify token 
//run then call next to proced
function verifyToken(req,res,next){

    //get auth header value 
    //we want to send token as header
    const bearerHeader = req.headers['authorization'];

    //check if bearer is undefined 
    if(typeof bearerHeader !=='undefined'){
        //split at the space
        const bearer = bearerHeader.split(' ');

        //get token from array 
        const bearerToken = bearer[1];
        req.token = bearerToken;

        //next middleware
        //this is the middle ware to allow them to proceeed
        next();
    
    }else{
        //forbidden
        //cannot access without token 
        res.sendStatus(401);
    }
}

/**************************
  PART 4
  this is the server. this handles the request from the client
 **************************/
app.get('',(req,res) => { 

    //get client signature
    var signature = req.get("Signature")

    message = "hello world"
    accesskey = 12345678998765323549

    //timestamp
    var ts = Math.floor(new Date() / 1000)

    //concatenate
    var body = accesskey + message + ts;

    //using hmac function
    signature2 = crypto.createHmac("sha256", body).digest("hex");

    //if clients signature and server signature match, allow acces to product table
    if (signature == signature2){
        app.get('db').query("SELECT * FROM products").then(products=> {

            /* can also send this status to client */
           // res.sendStatus(200);

           //here I am sending the protected resource to the client
            res.send(products);
        })
    }
    //or send error page
    else{
       res.sendStatus(401)
    }
 
});
 