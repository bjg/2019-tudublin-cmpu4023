const express = require('express'), app = express()
const port = 5000

require('massive')(
    {   host: '127.0.0.1',
        port: 5432,
        database: 'pgguide',
        user: 'postgres',
        password: '123456'
    }).then(instance => app.set("db", instance))



app.get('/users', async (req, res) => {
    res.send(await req.app.get("db").query("select email, details -> \'sex\' as sex FROM users ORDER BY created_at"))
} )

app.get('/users/:id', async (req, res) => {
    const user = await req.app.get("db").query('select email, details -> \'sex\' as sex from users WHERE id=' + req.params.id + ' ORDER BY created_at')
    res.send(user)
})

app.get('/products', async (req, res) => {
    const product = await req.app.get("db").query("select * from products ORDER BY price ASC;" )
    res.send(product)
})

app.get('/products/:id', async (req, res) => {
    const product = await req.app.get("db").query('select * from products WHERE id=' + req.params.id + ' ORDER BY created_at')
    res.send(product)
})

app.get('/purchases', async (req, res) => {
    res.send(await req.app.get("db").query('' +
        'select purchase_items.price, purchase_items.quantity, purchase_items.state, purchases.name ' +
        'AS RECEIVER_NAME, purchases.address ' +
        'AS RECEIVER_ADDRESS, users.email ' +
        'AS PURCHASERS_EMAIL ' +
        'from purchase_items INNER JOIN PURCHASES ' +
        'ON (purchase_items.purchase_id=purchases.id) INNER JOIN USERS ' +
        'ON (purchases.user_id=users.id) ' +
        'ORDER BY price DESC'))
})

//"Extend the product indexing endpoint to allow the filtering of products by name"
app.get('/products1', async (req, res) => {
    res.send( await req.app.get("db").query('' +
        "select * from products where title = '" + req.query.name +"';"
    ))
})

app.get('/productsInject1', async (req, res) => {
    res.send( await req.app.get("db").query('' +
        'select * from products where title = ${name};',
        { name: req.query.name, })
    )
})

app.get('/productsInject2', async (req, res) => {
    res.send(await req.app.get("db").selectProduct(req.query.name))
})

app.listen(port)
