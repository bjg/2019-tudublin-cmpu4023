const express = require('express');
const bodyParser = require('body-parser');

const product = require('./models').product;
const user = require('./models').user;
const purchase = require('./models').purchase;
const purchase_item = require('./models').purchase_item;

const PORT = 5000;

const app = express();

let jsonParser = bodyParser.json();

/* --- Question 5 start block ----

    Question 5 is contained in the seederse files

    run "sequelize db:seed:all"

 --- Question 5 end block ---- */

// ---- Question 6 start block ----


app.get('/products', (req, res) => {
    if(!isEmpty(req.query)){
        product.findAll({
            where:{
                title:req.query.title
            }
        })
        .then(product => product.length == 0 ? res.status(204).send(product) : res.status(200).send(product))
        .catch(err => res.status(503).send(err));
    }else{
        product.findAll()
        .then(products => res.status(200).send(products))
        .catch(err => res.status(503).send(err));
    }
});


app.get('/products/:id', (req, res) => {
    product.findAll({
        where:{
            id: req.params.id
        }
    })
    .then(product => product.length == 0 ? res.status(204).send(product) : res.status(200).send(product))
    .catch(err => res.status(503).send(err));
});


/* sample curl request for below post:

curl -X POST \
  http://localhost:5000/products/ \
  -H 'content-type: application/json' \
  -d '{
	"title": "My Lovely Horse",
	"price": 500,
	"tags":[
		"DVD",
		"Series"
	]
}'
*/

app.post('/products', jsonParser,(req, res) => {

    product.create({
        title:req.body.title,
        price: req.body.price,
        tags: req.body.tags
    }).then(newProduct => res.status(201).send(newProduct))
      .catch(err => res.status(503).send(err));
});

/* sample curl request for put below - updates and then redirects to products

curl -X PUT \
  http://localhost:5000/products/7 \
  -H 'content-type: application/json' \
  -d '{
	"title": "My Lovely Horse",
	"price": 500,
	"tags":[
		"CD",
		"Series"
	]
}'

*/

app.put('/products/:id', jsonParser,(req, res) => {

    product.update({
        title:req.body.title,
        price: req.body.price,
        tags: req.body.tags
    }, {
        where: {
            id: req.params.id
        }
    }).then(editedSuccessCode => res.status(200).redirect(303, `/products/${req.params.id}`))
      .catch(err => res.status(503).send(err));
});

/* sample curl request for below delete
    curl -X DELETE \
        http://localhost:5000/products/18 \
        -H 'content-type: application/json'
*/

app.delete('/products/:id', (req, res) => {

    product.findAll({
        where:{
            id: req.params.id
        }
    })
    .then(productToDelete => {
        purchase_item.destroy({
            where: {
                product_id: req.params.id
            }
        }).then(deletedPurchaseItems => {
            product.destroy({
                where:{
                    id: req.params.id
                }
            }).then((deletedProducts) => res.status(200).send(productToDelete))
            .catch(err => res.status(503).send(err))
        }).catch(err => res.status(503).send(err))
    }).catch(err => res.status(503).send(err));
})


// ---- Question 6 end block ----

let isEmpty = (obj) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
