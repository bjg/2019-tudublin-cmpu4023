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
        if(req.body.username != null && req.body.password != null){
            var username = req.body.username;
            var password = req.body.password;

            instance.query(`select * from users where username=${username} and password=${password}`).then(users => {
                var jwt_payload = {
                    name: users[0].username
                }
    
                const token = jwt.sign({jwt_payload}, 'secret', {expiresIn: '30s'});
    
                console.log(jwt_payload)
                console.log(token)
    
                res.json({
                    users,
                    token: token
                });
            });
        }
        else{
            res.send("Error")
        }        
    });

    app.get('/products', verifyToken, (req, res) => {      
        jwt.verify(req.token, 'secret', (err, data) => {
            if(err){
                res.send(err)
            }
            else{
                instance.query('select * from products').then(products => {
                    res.send(products)
                });
            }
        });
    });

    function verifyToken(req, res, next){
        const bearer_header = req.headers['authorization'];
        
        if(typeof bearer_header == 'undefined'){
            res.sendStatus(403);
        }
        else{
            req.token = bearer_header.split(" ")[1];
            next();
        }
    }
});