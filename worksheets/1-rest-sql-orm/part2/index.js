const express = require('express'),
    db = require('./sequelize'),
    bodyParser = require('body-parser')

app = express()
app.use(bodyParser.json()).listen(3000);
db.sequelize.sync()

app.get('/products', async (req, res) => {
    if (req.query.name) {
        const product = await db.models.Product.findOne({ where: { title: req.query.name } })
        res.send( (product) ? product : "No product with that name found")

    } else res.status(200).send(await db.models.Product.findAll())
})

app.get('/products/:id', async (req, res) => {
    const product = await db.models.Product.findOne({ where: { id: req.params.id } })
    res.send( (product) ? product : "No product found with that id")
})

app.post('/products', async (req, res) => {
    const product = await db.models.Product.create(req.body)
    res.send("Created a new user with the id: " + product.dataValues.id)
})

app.put('/products/:id', async (req, res) => {
    //to append to tags
    if (req.body.tags) req.body.tags = db.sequelize.fn('array_append', db.sequelize.col('tags'), req.body.tags)

    const update = await db.models.Product.update(req.body, {where: {id: req.params.id}})
    res.send( (update[0] === 0) ? 'Update was unsuccessful' : 'Product updated successfully')
})

app.delete('/products/:id', async (req, res) => {
    const product = await db.models.Product.destroy({ where: { id: req.params.id } })
    res.send( (product === 1) ? "Deleted" : "No product with that id")
})
