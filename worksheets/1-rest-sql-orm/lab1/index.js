const express = require('express')
const massive = require('massive');

const app = express()
const portNumber = 3000

massive({
    host: 'localhost',
    port: 5432,
    database: 'pgguide',
    user: 'admin1',
    password: 'password',
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


    app.get('/sqlProtected/products', async (req, res) => {
        const result = await req.app.get('db').query('select * from products where title = ${name};', {
            name: req.query.name,
        });
        res.json(result);
    });
	
    app.get('/sqlProtected2/products', async (req, res) => {
        const products2 = await req.app.get('db')selectProduct(req.query.name);
        res.json(products2);
    });

	/* example of vunerable URL is http://localhost:3000/products?name=Ruby%20Book%27;delete%20from%20purchase_items%20where%20product_id%20=%204;delete%20from%20products%20where%20id%20=%204;%20select%20*%20from%20products%20where%20title=%27Ruby%20Book
	*/
    app.get('/products', async (req, res) => {
        try {
            const byTitle = req.query.name ? `where title = '${req.query.name}'` : ''
            const query = `select * from products ${byTitle};`
            console.log(query)
            const result = await req.app.get('db').query(`select * from products ${byTitle} order by price asc;`);
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
        const result = await db.query('select name, address,users.email, price, quantity, purchase_items.state from purchases join purchase_items on purchases.id = purchase_items.purchase_id join users on users.id = purchases.user_id order by price desc;;');
        res.json(result);
    });
    
    app.listen(portNumber, () => console.log(`application open on ${portNumber}`))
})


