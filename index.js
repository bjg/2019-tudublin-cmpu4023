const jwt = require('jsonwebtoken')
const express = require('express')
const massive = require('massive')
const app = express()
const port = 3000;

app.listen(port, () => console.log(`Successfully listening on port ${port}`))

const jwt_header = {
    "typ": "JWT",
    "alg": "HS256"
}

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
        instance.query('select * from users').then(users => {
            
            // var log_in_date = new Date();
            // var log_in_expire = new Date();
            // log_in_expire.setDate(log_in_date.getDate() + 1)            

            var jwt_payload = {
                name: users[0].username,
            }

            const token = jwt.sign({jwt_payload}, 'secret', {expiresIn: '24h'});
            
            console.log(jwt_payload)
            console.log(token)
            res.send(users)
        });
    });
});