const jwt = require('jsonwebtoken')
const express = require('express')
const body_parser = require('body-parser')
const massive = require('massive')
const app = express()
const port = 3000;
var token_value = "";

app.use(body_parser());

app.listen(port, () => console.log(`Successfully listening on port ${port}`))

massive({
    host: 'localhost',
    port: 5432,
    database: 'week2',
    user: 'postgres',
    password: 'Kevisarat',
    ssl: false,
    poolSize: 10    
}).then(instance => {
app.set('db', instance)

    app.get('/', (req, res) => {
        res.sendFile('login.html', { root: __dirname });
    });


    app.post('/', (req, res) => {
        
        // var username = req.body.username;
        // var password = req.body.password;

        var username = "Finny D";
        var password = "FOD123";

        console.log("UserName: " + username + " Password: " + password)

        instance.query(`select * from users where username='${username}' and password=crypt('${password}', password)`)
        .then(users => {
            console.log(users)
            const expire_time = '60s';

            if(users.length > 0){
                var jwt_payload = {
                    id: users[0].userid,
                    name: users[0].username,
                    expire_time: expire_time
                }
    
                jwt.sign({jwt_payload}, 'secret', {expiresIn: `${expire_time}`}, (err, token) => {                    
                    res.redirect(`http://localhost:3000/products?token=Bearer ${token}`);
                });
                
            }
            else{
                res.send("No user found")
            }            
        });     
    });

    app.get('/products', verifyToken, (req, res) => {      
        jwt.verify(req.token, 'secret', (error, data) => {
            if(error){
                res.send(error)
            }
            else{
                instance.query('select * from products').then(products => {
                    res.send(products)
                });
            }
        });
    });

    function verifyToken(req, res, next){
        if(typeof bearer_header == 'undefined'){
            if(req.query.token == null){
                res.sendStatus(403);
            }
            else{
                req.headers.authorization = req.query.token;
                const bearer_header = req.headers['authorization'];
            
                req.token = bearer_header.split(" ")[1];
                next();
            }
        }
        else{
            const bearer_header = req.headers['authorization'];

            req.token = bearer_header.split(" ")[1];
            next();
        }
    }
});