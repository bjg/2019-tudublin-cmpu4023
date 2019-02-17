const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    req.app.get('db').products.find(
        {},
        {
            fields: ['title', 'price'],
            order: [{
                field: 'price',
                direction: 'asc',
                nulls: 'last'
            }]
        }
    )
        .catch(err => { console.log('Failed to load users from DB'); })
        .then(items => {
            res.send( JSON.stringify(items, null, 2) );
        });
});

router.get('/injection', (req, res) => {
    /*
        http://localhost:3000/products/injection?name=0%3BDrop%20Table%20JohnCena%3B
     */
    const queryString = 'select title, price from products where id = ' + req.query.name;

    req.app.get('db').query(queryString).then(items => {
        res.send( JSON.stringify(items, null, 2) );
    });
});

router.get('/:id', (req, res) => {
    req.app.get('db').products.find(
        {
            id: req.params.id
        },
        {
            fields: ['title', 'price']
        }
    )
        .catch(err => { console.log('Failed to load users from DB'); })
        .then(items => {
            res.send( JSON.stringify(items, null, 2) );
        });
});



module.exports = router;