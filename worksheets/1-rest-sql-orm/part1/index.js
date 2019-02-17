const express = require('express'),
    app = express()

require('massive')({ host: '127.0.0.1',  port: 5432, database: 'pgguide', user: 'postgres', password: '1234566' })
    .then(massiveInstance => app.set("db", massiveInstance))

app.get('/users', async (req, res) => res.status(200).send(await req.app.get("db").query("select email, details -> \'sex\' as sex FROM users ORDER BY created_at DESC")) )

app.get('/users/:id', async (req, res) => {
    const user = await req.app.get("db").query('select email, details -> \'sex\' as sex from users WHERE id=' + req.params.id)
    res.send( (user.length === 0 ) ? 'No user with that id' : user )
})

app.get('/products', async (req, res) => {
    //sql inject with: ?name='; delete from purchase_items where product_id=12; DELETE FROM products where id=12 or title='
    console.log(req.query)
    const product = await req.app.get("db").query( (req.query.name) ? "select * from products where title= '" + req.query.name + "'" : "select * from products ORDER BY price ASC;" )
    res.send(product)
})

app.get('/products/:id', async (req, res) => {
    const product = await req.app.get("db").query('select * from products WHERE id=' + req.params.id)
    res.send( (product.length === 0) ? 'No product with that id' : product )
})

app.get('/purchases', async (req, res) => {
    res.send(await req.app.get("db").query('' +
        'select price, purchase_items.state, purchase_id, name, address, email from purchase_items ' +
        'join purchases on purchase_items.purchase_id = purchases.id ' +
        'join users on users.id = purchases.user_id ' +
        'ORDER BY price DESC'))
})

app.get('/productsInjectionSafe1', async (req, res) => res.send( await req.app.get("db").query('select * from products where title = ${name};', { name: req.query.name, }) ))

/** the following procedure was added to the database through command line
 create or replace function select_products(Name VARCHAR(30) )
 returns setof products
 as
 $$
 select * from products where title = Name;
 $$
 language sql;
 */
app.get('/productsInjectionSafe2', async (req, res) => res.send(await req.app.get("db").select_products(req.query.name)))

app.listen(3000)