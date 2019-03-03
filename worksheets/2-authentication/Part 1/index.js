const express = require("express"); //get a reference to the express module
const app = express(); //launch express application
const bodyParser = require('body-parser');
const massive = require('massive');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extends:false}));

app.set('view engine', 'ejs');

massive({
    host: 'localhost',
    port: 5432,
    database: 'kart',
    user: 'postgres',
    password: '8myd!nner',
    ssl: false,
    poolSize: 10
  }).then(instance => {
    app.get('/', (req,res,next) => {
        res.render('login');
    });
    
    app.post('/products', (req,res) => {
        
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
                    instance.query("Select * from products").then(products =>{ 
                        res.json(products);
                    }).catch(err =>{
                        console.log(err);
                    });
                }else{
                    res.json({
                        error:"User Doesnt exist"
                    })
                }
            }).catch(err => console.log(err));
            
        }//end else
        
    });
  }).catch(err =>{
      console.log(err);
  });





app.listen(3000,()=>console.log ("http://127.0.0.1:3000"));