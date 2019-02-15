const { app, port } = require('./initApp.js')
const { Product, sequelize } = require('./initDB')

sequelize.authenticate()
    .then(() => {
        console.log('Connected successfully.');

        app.get('/products', async (req, res) => {
            const search = req.query.name ? { where: { title: req.query.name } } : {}
            res.json(await Product.findAll(search))
        })

        app.get('/products/:id', async (req, res) => {
            const product = await Product.findOne({
                where: {
                    id: req.params.id,
                },
            })

            if (!product) {
                res.statusCode = 404
                res.send('Product does not exist')
            }

            res.json(product)
        })

        app.post('/products', (req, res) => {
            const product = Product.build(req.body) 
            product.save()
                .then(response => { res.json(response) })
                .catch(err => {
                    res.statusCode = 400
                    res.json(err)
                    res.cod
                })
        })

        app.put('/products/:id', async (req, res) => {
            const product = await Product.findOne({
                where: {
                    id: req.params.id,
                },
            })

            if (!product) {
                res.statusCode = 404
                res.send('Product does not exist')
            }

            product.update(req.body)
                .then(result => res.json(result))
                .catch(err => {
                    res.statusCode = 400
                    res.json(err)
                    res.cod
                })
        })

        app.delete('/products/:id', async (req, res) => {
            const product = await Product.findOne({
                where: {
                    id: req.params.id,
                },
            })

            if (!product) {
                res.statusCode = 404
                res.send('Product does not exist')
            }

            product.destroy()
            res.end()
        })

        app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    })
    .catch((err) => {
        console.log('Failed', err)
})
