const express = require('express');
const massive = require('massive');
// const indexRouter = require('./routes/index');
const users = require('./routes/users');
const products = require('./routes/products');
const purchases = require('./routes/purchases');

const app = express();

// app.use('/', indexRouter);
app.use('/users', users);
app.use('/products', products);
app.use('/purchases', purchases);

massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'pgguide',
    user: '[YOUR USER]',
    password: '[YOUR PASS]'
}).then(db => {
    app.set('db', db);
    app.get('/', (req, res) => res.send('For testing the sqlinjection route, create a table called JohnCena ' +
        'and use the following url http://localhost:3000/products/injection?name=0%3BDrop%20Table%20JohnCena%3B'));
    app.listen(3000, () => console.log(`Example app listening on port 3000!`));
});
