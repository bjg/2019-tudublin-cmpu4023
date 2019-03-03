const express = require('express')
const body_parser = require('body-parser')
const massive = require('massive')
const crypto = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");
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

        // var username = "Finny D";
        // var password = "FOD123";

        console.log("UserName: " + username + " Password: " + password)

        instance.query(`select * from users where username='${username}' and password=crypt('${password}', password)`)
        .then(users => {
            console.log(users)
            const expire_time = '240s';

            if(users.length > 0){
                res.redirect(`http://localhost:3000/products`);                    
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

    app.post('/products', verify, (req, res) => {      
        instance.query('select * from products').then(products => {
            res.send(products)
        });
    });

    app.put('/products/price', (req, res) => {      
        const { prod_id, price } = req.body;

        instance.query(`UPDATE products SET price = '${price}' WHERE id = ${prod_id}`)
        .then(result =>{
            res.send(result)
        });
    });
    //HMAC-SHA256 Key=KEY Signature=SIGNATURE
    function verify(req, res, next){
        const auth_header = req.headers['authorization'];

        const key = auth_header.split("Key=")[1].split(" ")[0]
        const signature = auth_header.split("Signature=")[1].split(" ")[0]
        const data = req.body

        

        instance.query(`SELECT secret_key FROM users WHERE access_key = \'${key}\'`).then(s_key =>{
            if(s_key.length > 0){
                const url = 'http://localhost:3000' + req.url;
                const comparison_data = `${url}${JSON.stringify(data)}${key}`;
                console.log(comparison_data)
                const comparison_signature = crypto.HmacSHA256(comparison_data, s_key[0].secret_key);

                console.log("Sig:: " + signature);
                console.log("Cmp: " + Base64.stringify(comparison_signature))
                if(Base64.stringify(comparison_signature) == signature){
                    console.log("Same")
                    next();
                }
                else{
                    console.log("Not The Same")
                }
            }
        });
    }
});