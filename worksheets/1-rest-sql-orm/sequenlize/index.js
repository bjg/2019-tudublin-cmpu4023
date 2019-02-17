//curl http://localhost:3000/products

const express = require('express');
const app = express();
const port = 3000;
const models = require('./server/models');


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// models.users.create({id: 1, email: 'ap@gmail.com', password: 'password', details: '"sex"=>"F"'});
// models.products.create({id: 2, title: 'Dictionary', price: '9.99', tags: ['Book']});
// models.purchases.create({name: 'boo radley', address: '123 raod lane', state: "FL", zipcode:12345, user_id: 1});
// models.purchases_items.create({purchase_id:3, product_id:2, price: '20', quantity: 2, state: "Delivered"});
//
// //PART 2
app.get('/products', (req, res) => {

    if (req.query.name) {
        models.products.findAll({where: {title: req.query.name}}).then(data => res.send(data));

    } else {
        models.products.findAll().then(data => {
            res.send(data)
        })
    }
// });
//
// //PART 3
// app.get('/products/:id', (req, res) => {
//     models.products.findOne({ where: { id:req.params.id}}).then(data => {
//         res.send(data)
//     })
// });
//
// //PART 3 POST
// app.post('/products', (req, res) => {
//
//     const title = req.query.title;
//     const price = req.query.price;
//     const tags = req.query.tags;
//
//     models.products.create({title: title, price: price, tags: tags}).then(data =>
//         res.send(data))
// });
//
// //PART 4 PUT
// app.put('/products/:id', (req, res) => {
//
//     const updated = req.query;
//
//     models.products.findOne({where: {id: req.params.id}}).then(data => {
//         return data.updateAttributes(updated)}).then(results => {
//         res.send(results);
//     });
// });
//
// //PART 5 DELETE
// app.delete('/products/:id', (req, res) => {
//
//     const id = req.params.id;
//     models.products.destroy({where: {id: id}}).then(results =>
//         res.send(results))
// });
});