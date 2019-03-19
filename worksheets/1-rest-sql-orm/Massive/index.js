const massive = require('massive');
const express = require('express')
const app = express()
const open_port = 3000
/*
ATTACK CODE: http://jackmccormack.info:3000/unsafe/products?name=Baby%20Book%27;delete%20from%20purchase_items%20where%20product_id%20=%2012;delete%20from%20products%20where%20id%20=%2012;%20select%20*%20from%20products%20where%20title=%27Baby%20Book
*/
massive({
    host: 'localhost',
    port: 5432,
    database: 'pgguide',
    user: 'jack',
    password: 'orbien',
    ssl: false,
    poolSize: 10,
}).then(instance => {
    app.set('orb', instance)
	
	//1. List all users email and sex in order of most recently created. 
    app.get('/api/getUsers', async (request, response) => {
        const users = await request.app.get('orb').query('SELECT email, details -> \'sex\' AS Sex FROM users ORDER BY created_at desc');
        response.json(users);
    });
	//1. Show above details of the specified user
	app.get('/api/getUsers/:id', (request, response) => {
		request.app.get('orb').users.find({ 'id =': request.params.id }).then(users => {
			response.json(users);
		}).catch(err => response.json(err));
	});

	//1. List all products in ascending order of price	
	app.get('/api/getProducts', async (request, response) => {
        const users = await request.app.get('orb').query('SELECT * FROM products ORDER BY price ASC');
        response.json(users);
	});
	
	//1. Show details of the specified products
	app.get('/api/getProducts/:id', (request, response) => {
        request.app.get('orb').products.find({ 'id =': request.params.id }).then(products => {
            response.json(products);
        });
    });
	
	//1. List purchase items to include the receiver’s name and, address, the purchaser’s email address and the price, quantity and delivery status of the purchased item. Order by price in descending order
    app.get('/api/getPurchases', async(request, response) => {
		const orb = await request.app.get('orb');
        const result = await orb.query(`SELECT products.title, purchases.name, purchases.address, users.email, 
        purchase_items.price, purchase_items.quantity, purchase_items.state 
        FROM purchases 
        INNER JOIN users on purchases.user_id = users.id
        INNER JOIN purchase_items on purchase_items.purchase_id = purchases.id
        INNER JOIN products on purchase_items.product_id = products.id
        ORDER BY purchase_items.price DESC`)
        .then (result => {
            response.send(result)
        }).catch(err => response.json(err));
    });
    

	
	//2. Get products safely
	app.get('/api/getSafeProducts', (request, response) => {
        const search = request.query.name ? { 'title =': request.query.name } : {};
        request.app.get('orb').products.find(search).then(products => {
            response.json(products);
        }).catch(err => response.json(err));
    });
	
	//2. Get products unsafely
    app.get('/api/getUnsafeProducts', async (request, response) => {
        try {
            const byTitle = request.query.name ? `where title = '${request.query.name}'` : ''
            const query = `select * from products ${byTitle};`
            console.log(query)
            const response = await request.app.get('orb').query(`select * from products ${byTitle};`);
            response.json(response);
        }
		catch(err) {
            response.json(err);
        }
    });


    app.listen(open_port, () => console.log(`Now available on port: ${open_port} \nCtrl + C to close, NOT Ctrl + Z.. fg to fix`))
})

