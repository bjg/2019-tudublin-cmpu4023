//Helen Murphy
//Lab 1

module.exports = (app, db) => {


    //Gets all products in the database
    app.get( "/products", (req, res) =>
        db.products.findAll().then((result) =>
            res.json(result))
    );

    //Gets products with matching id
    app.get( "/products/:id", (req, res) =>
        db.products.findById(req.params.id).then((result) =>
            res.json(result))
    );


    //creates products entry with title and price
    app.post('/products', function (req, res) {
        //values for new entry
        db.products.create({
            title: req.body.title,
            price: req.body.price
        }).then(function (products) {

            res.json(products);
        });
    });

    //updates title and price of product with matching id
    app.put( "/products/:id", (req, res) =>
        //values for update
        db.products.update({
                title: req.body.title,
                price: req.body.price
            },

            {
                where: {
                    id: req.params.id
                }
            }).then( (result) => res.json(result) )
    );


    //deletes product with matching id
    app.delete( "/products/:id", (req, res) =>
        db.products.destroy({
            where: {
                id: req.params.id
            }
        }).then( (result) =>
            res.json(result) )
    );
}