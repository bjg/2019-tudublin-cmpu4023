/////////// IMPORTS /////////////////////////////

const express = require('express');
const router = express.Router();

//MODELS
const usersObj = require('../models/users');
const Users = usersObj.get('Users');

const productsObj = require('../models/products');
const Products = productsObj.get('Products');

const purchasesObj = require('../models/purchases');
const Purchases = purchasesObj.get('Purchases');

const purchase_itemsObj = require('../models/purchase_items');
const Purchase_items = purchase_itemsObj.get('Purchase_items');


//For Posting
var bodyParser = require('body-parser')
router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

///////////// Functions /////////////////////////////////////
//for problem set 5
// Functions to create new data - I will pass parameters of data into each function to create a new data row
function create_user(email, password, details) {

    Users.create({
            email: email,
            password: password,
            details: details
        })
        //checking it doesnt already exist
        .then(() => Users.findOrCreate({
            where: {
                email: email,
                password: password,
                details: details
            }
        }))
        .spread((users, created) => {
            console.log(users.get({
                plain: true
            }))
            console.log(created);
        })

}
// function to create a new product
function create_product(title, price, tags) {
    Products.create({
            title: title,
            price: price,
            tags: tags
        })
        //checking it doesnt already exist
        .then(() => Products.findOrCreate({
            where: {
                title: title,
                price: price,
                tags: tags
            }
        }))
        .spread((products, created) => {
            console.log(products.get({
                plain: true
            }))
            console.log(created);
        })

}

//function to create a new purchase
function create_purchases(name, address, state, zipcode, user_id) {
    Purchases.create({
            name: name,
            address: address,
            state: state,
            zipcode: zipcode,
            user_id: user_id
        })
        //checking it doesnt already exist
        .then(() => Purchases.findOrCreate({
            where: {
                name: name,
                address: address,
                state: state,
                zipcode: zipcode,
                user_id: user_id
            }
        }))
        .spread((purchases, created) => {
            console.log(purchases.get({
                plain: true
            }))
            console.log(created);
        })

}

//function to create a purchase items entry
function create_purchase_items(purchase_id, product_id, price, quantity, state) {
    Purchase_items.create({
            purchase_id: purchase_id,
            product_id: product_id,
            price: price,
            quantity: quantity,
            state: state
        })
        //checking it doesnt already exist
        .then(() => Purchase_items.findOrCreate({
            where: {
                purchase_id: purchase_id,
                product_id: product_id,
                price: price,
                quantity: quantity,
                state: state
            }
        }))
        .spread((purchase_items, created) => {
            console.log(purchase_items.get({
                plain: true
            }))
            console.log(created);
        })

}


///////////////////// ENDPOINTS //////////////////////////
// main endpoint to return home page
router.get('/', (req, res, next) => {
    res.render('home', null);
});

// getting all of the users 
router.get('/users', (req, res) => {

    Users.findAll().then(users => {
        res.send(users);
    }).catch(err => console.log(err));

});


// getting all of the products 
router.get('/products', (req, res, next) => {

    if (!req.query.name) {
        console.log('no params');

        Products.findAll().then(products => {
            res.send(products);
        }).catch(err => console.log(err));
    } else {
        next();
    }

});

// getting all of the purchases 
router.get('/purchases', (req, res) => {

    Purchases.findAll().then(purchases => {
        res.send(purchases);
    }).catch(err => console.log(err));

});

// getting all of the purchase_items
router.get('/purchase_items', (req, res) => {

    Purchase_items.findAll().then(purchase_items => {
        res.send(purchase_items);
    }).catch(err => console.log(err));

});

//Problem set 5 - creating test data
router.get('/createtestdata', (req, res) => {
    //Calling models to create data
    create_user('strong.erik@gmail.com', 'password123', {
        sex: 'M'
    });

    create_product("Drum Kit", 1500.00);

    create_purchases("Eric Strong", "19 Riversdale Palmerstown", "DU", 01, 51); // Eric is user 51

    create_purchase_items(1001, 24, 1500.00, 1, "Pending"); // purchase_id 1001 , product_id 24 price 1500, quant 1 this may need to be dynamic

    res.send('Data has been inserted!');
    //res.status(200);


});

// Problem set 6 - RESTFul API - with new and improved endpoints
//6.1
router.get('/products', (req, res) => {
    if (req.query.name) {
        console.log('got params!');
        var name = req.query.name; // name is the actual variable name
        console.log(name);

        // search for attributes
        Products.findOne({
            where: {
                title: name
            }
        }).then(products => {
            res.send(products);
        })
    }
});

// 6.2
router.get('/products/:id', (req, res) => {
    var id = req.params.id;
    console.log('id:' + id);

    Products.findByPk(id).then(products => {
        res.send(products);
    })
}); // request response

//6.3
router.post('/products', (req, res) => {

    console.log('posting ' + req.body.title);

    //reusing my function from above
    create_product(req.body.title, req.body.price);

    res.json({
        status: 'successful',
        data: req.body
    });

}); // request response

//6.4
router.put('/products/:id', (req, res) => {
    var id = req.params.id;
    console.log('PUT - Updating');
    Products.update({
        updatedAt: new Date(),
        title: req.body.title,
        price: req.body.price,
        tags: req.body.tags,
    }, {
        where: {
            id: id
        }
    });
    // UPDATE product SET updatedAt = x title = x price = x tags = x WHERE id = param.id;
    res.json({
        status: 'successful update',
        data: req.body
    });
});


//6.5
router.delete('/products/:id', (req, res) => {
    var id = req.params.id;

    console.log('DELETING');
    Products.destroy({
        where: {
            id: id
        }
    });
    res.send(id + ' deleted');
});

//exporting the router module so it can be imported
module.exports = router