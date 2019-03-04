const jwt = require('jsonwebtoken')
const express = require('express')
const body_parser = require('body-parser')
const massive = require('massive')
const app = express()
const port = 3000;

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
        var username = req.body.username;
        var password = req.body.password;

        console.log("UserName: " + username + " Password: " + password)

        instance.query(`select * from users where username='${username}' and password=crypt('${password}', password)`)
        .then(users => {
            console.log(users)
            const expire_time = '24h';

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

    app.put('/:id', (req, res) => {
        const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
        var accessKey = "";
        var secretKey = "";

        for(i=0; i < 20; i++){
            accessKey = accessKey + char[parseInt(Math.random() * (char.length - 0))]
        }

        for(i=0; i < 40; i++){
            secretKey = secretKey + char[parseInt(Math.random() * (char.length - 0))]
        }
        instance.query(`SELECT access_key, secret_key from users where userid = ${req.params.id}`).then(userInfo =>{
           if(userInfo.length > 0){
                if(userInfo[0].access_key == null || userInfo[0].secret_key == null){
                    instance.query(`UPDATE users SET access_key = '${accessKey}', secret_key = '${secretKey}' WHERE userid= ${req.params.id}`).then(result =>{
                            res.send(result);
                        });
                }
                else{
                    res.send("Already Generated")
                }
           }
           else{
               res.send("No User Found")
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

    app.put('/products/price', verifyToken, (req, res) => {      
        jwt.verify(req.token, 'secret', (error, data) => {
            if(error){
                res.send(error)
            }
            else{
                const { prod_id, price } = req.body;

                instance.query(`UPDATE products SET price = '${price}' WHERE id = ${prod_id}`)
                .then(result =>{
                    res.send(result)
                });
            }
        });
    });

    function verifyToken(req, res, next){
        if(typeof req.headers['authorization'] == 'undefined'){
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