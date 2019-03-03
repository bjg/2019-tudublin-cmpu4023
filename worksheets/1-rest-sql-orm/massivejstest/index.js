const massive = require('massive');
const express = require('express');
const app = express();

/* Load your route files */
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const purchasesRouter = require('./routes/purchases');

/* Define your routes */
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/purchases', purchasesRouter);

/* Connect Massive to DB */
massive({
    host: 'localhost',
    port: 5432,
    database: 'pgguide',
    user: 'postgres',
    password: '28101997'
}).then(db => { 
    /* You can now use req.app.get('db') */
    app.set('db', db);
});

app.listen( 3000, function() {
  console.log( 'Server listening on port 3000' ) ;
} ) ;
