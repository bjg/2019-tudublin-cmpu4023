const express = require('express')
const massive = require('massive');

const app = express()
const port = 5000

massive({
    host: 'localhost',
    port: 5432,
    database: 'pgguide4',
    user: 'postgres',
    password: 'toor',
    ssl: false,
    poolSize: 10,
}).then(instance => {
    app.set('db', instance)

    app.get('/users', async (req, res) => {
        const users = await req.app.get('db').query('select email, details -> \'sex\' AS sex from users order by created_at desc;');
        res.json(users);
    });

    app.get('/users/:id', async (req, res) => {
        const users = await req.app.get('db').query('select email, details -> \'sex\' AS sex from users where id = ${id} order by created_at desc;', {
            id: req.params.id,
        });
        res.json(users);
    });

    app.get('/products', (req, res) => {
        const search = req.query.name ? { 'title =': req.query.name } : {};
        req.app.get('db').products.find(search).then(products => {
            res.json(products);
        }).catch(err => res.json(err));
    });

    app.get('/safe/products', async (req, res) => {
        const result = await req.app.get('db').query('select * from products where title = ${name};', {
            name: req.query.name,
        });
        res.json(result);
    });

    app.get('/unsafe/products', async (req, res) => {
        try {
            const byTitle = req.query.name ? `where title = '${req.query.name}'` : ''
            const query = `select * from products ${byTitle};`
            console.log(query)
            const result = await req.app.get('db').query(`select * from products ${byTitle};`);
            res.json(result);
        } catch(err) {
            res.json(err);
        }
    });

    app.get('/products/:id', (req, res) => {
        req.app.get('db').products.find({ 'id =': req.params.id }).then(products => {
            res.json(products);
        });
    });

    app.get('/purchases', async (req, res) => {
        const db = await req.app.get('db');
        const result = await db.query('select name, address, price, quantity, purchase_items.state from purchases join purchase_items on purchases.id = purchase_items.purchase_id order by price desc;;');
        res.json(result);
    });
    
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
})


/*

SQL attack: http://localhost:5000/unsafe/products?name=Dictionary%27;delete%20from%20purchase_items%20where%20product_id%20=%202;delete%20from%20products%20where%20id%20=%202;%20select%20*%20from%20products%20where%20title=%27Dictionary

*/