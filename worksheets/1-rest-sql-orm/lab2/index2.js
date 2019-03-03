const { app, portNumber } = require('./initApp.js')
const { Products, sequelize } = require('./initDB')

sequelize.authenticate()
    .then(() => {
        console.log('Connected successfully.');

        app.get('/products', async (req, res) => {
            const search = req.query.name ? { where: { title: req.query.name } } : {}
            res.json(await Products.findAll(search))
        })

        app.get('/products/:id', async (req, res) => {
            const products = await Products.findOne({
                where: {
                    id: req.params.id,
                },
            })

            if (!products) {
                res.statusCode = 404
                res.send('That is not a product')
            }

            res.json(products)
        })

        app.post('/products', (req, res) => {
            const products = Products.build(req.body) 
            products.save()
                .then(response => { res.json(response) })
                .catch(err => {
                    res.statusCode = 400
                    res.json(err)
                    res.cod
                })
        })

        app.put('/products/:id', async (req, res) => {
            const products = await Products.findOne({
                where: {
                    id: req.params.id,
                },
            })

            if (!products) {
                res.statusCode = 404
                res.send('Product does not exist')
            }

            products.update(req.body)
                .then(result => res.json(result))
                .catch(err => {
                    res.statusCode = 400
                    res.json(err)
                    res.cod
                })
        })

        app.delete('/products/:id', async (req, res) => {
            const products = await Products.findOne({
                where: {
                    id: req.params.id,
                },
            })

            if (!products) {
                res.statusCode = 404
                res.send('Product does not exist')
            }

            products.destroy()
            res.end()
        })

        app.listen(port, () => console.log(`application is listening on port number ${portNumber}!`))
    })
    .catch((err) => {
        console.log('Failed', err)
})
