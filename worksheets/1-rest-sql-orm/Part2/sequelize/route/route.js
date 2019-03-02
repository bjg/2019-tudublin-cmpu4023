'use strict';

module.exports = (app, db) => {

    app.get('/products', async (req, res) => {
        res.json(await Products.findAll())
    })

    app.get('/products/:id', async (req, res) => {
        const id = req.params.id
        const product = await Products.findOne({
            where: { id: id }
        })

        if (!product) {
            res.statusCode = 404
            res.send('Product does not exist')
        }

        res.json(product)
    })

    app.post('/products', (req, res) => {
        const productCreate = Products.build(req.body)

        productCreate.save()
            .then(response => { res.json(response) })
            .catch(err => {
                res.statusCode = 400
                res.send('Error: ' + err)
            })
    })

    app.put('/products/:id', async (req, res) => {
        const id = req.params.id
        const productUpdate = await Products.findOne({
            where: { id: id }
        })

        if (!productUpdate) {
            res.statusCode = 404
            res.send('Product does not exist')
        }

        productUpdate.update(req.body)
            .then(result => res.json(result))
            .catch(err => {
                res.statusCode = 400
                res.json(err)
                res.cod
            })
    })

    app.delete('/products/:id', async (req, res) => {
        const id = req.params.id

        const productDelete = await Products.findOne({
            where: { id: id }
        })

        if (!productDelete) {
            res.statusCode = 404
            res.send('Product does not exist')
        }

        productDelete.destroy()
        res.end()
    })
}

