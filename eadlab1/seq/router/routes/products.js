'use strict';

module.exports = (app, db) => {

    // Q6.1 GET products?name=string

    app.get('/products', async(req, res) => {
        const search = req.query.name ? { where: { title: req.query.name } } : {}
        res.json(await products.findAll(search))
    })

    // Q6.2 Get products by ID
    app.get('/products/:id', async(req, res) => {
        const product = await Products.findOne({
            where: {
                id: req.params.id,
            },
        })
        res.json(product)
    })

    // Q6.3 POST a new product
    app.post('/products', (req, res) => {
        const title = req.body.name;
        const price = req.body.price;
        const created_at = req.body.created_at;
        const deleted_at = req.body.deleted_at;
        const tags = req.body.tags;
        db.products.create({
                title: title,
                price: price,
                created_at: created_at,
                deleted_at: deleted_at,
                tags: tags
            })
            .then(newProduct => {
                res.json(newProduct);
            })
    });

    // Q6.4 Put/Update/Patch a product
    app.patch('/products/:id', (req, res) => {
        const id = req.params.id;
        const updates = req.body.updates;
        db.products.find({
                where: { id: id }
            })
            .then(products => {
                return products.updateAttributes(updates)
            })
            .then(updatedProduct => {
                res.json(updatedProduct);
            });
    });

    // Q6.5 DELETE single product
    app.delete('/products/:id', (req, res) => {
        const id = req.params.id;
        db.products.destroy({
                where: { id: id }
            })
            .then(deletedProduct => {
                res.json(deletedProduct);
            });
    });
};