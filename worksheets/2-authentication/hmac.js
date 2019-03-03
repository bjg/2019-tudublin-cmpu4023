const express = require('express');
var bodyParser = require('body-parser');
const massive = require('massive');
const crypto = require('crypto');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'lab3',
    user: 'postgres',
    password: ''
}).then(instance => {

    app.set('db', instance);

    app.post('/api/products', (req, res) => {

        const ACCESS_KEY = 'uj&7AK6^A#e|R,Vn[m$A'
        const SECRET_KEY = 'uj&7AK6^A#e|R,Vn[m$A=^B;aaAb@{c]3@n=pnZW'

        const hash = crypto.createHmac('sha256', ACCESS_KEY).update(SECRET_KEY).digest('hex')

        if(hash === req.headers['authorization']) {
            
            req.app.get('db').query (
                "SELECT * FROM \"Products\""
            ).then(products => {
                res.json(products);
            })

        } else {
            res.status(403).json({
                Status: 'Forbidden'
            });
        }

    });
    
    app.listen(port);

});
