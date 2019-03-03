'use strict';

module.exports = (app, db) => {

    //curl http://localhost:3000/products
    app.get('/products', (req, res) => 
    {
        db.products.findAll()
        .then(result =>{
            res.json(result);
        });
    });
    //curl http://localhost:3000/products/24
    app.get('/products/:id', (req, res) =>{
        const id = req.params.id;
        db.products.findOne({
            where:{id: id}
        })
        .then(result => {
            res.json(result);
        });
    });
    //curl --data "title=Great%20Songs&price=12.00&tags=Music,Pop"  http://localhost:3000/products
    app.post('/products', (req, res) => {
        const inputTitle = req.body.title;
        const inputPrice = req.body.price;
        const inputTags = req.body.tags;
        const today = new Date();

        console.log("\nTitle: "+req.body.title+"\nPrice: "+req.body.price+"\nTags: "+req.body.tags+"\n Todays Date"+today+"\n\n\n");
        db.products.create({
            title:inputTitle,
            price:inputPrice,
            tags:[inputTags],
            createdAt: today
        })
        .then(postProduct =>{
            res.json(postProduct);
        });
    });
    //curl -X PUT -d "title=mkyong&price=14.25" http://localhost:3000/products/25
    app.put('/products/:id', (req, res) => {
        const id = req.params.id;
        const updateTitle = req.body.title;
        const updatePrice = req.body.price;
        const updateTags = req.body.tags;

        console.log(updatePrice+" "+updateTags+" "+updateTitle+"\n\n\n");
        db.products.findOne({
            where:{id:id}
        })
        .then(product =>{
            if(updateTitle){
                product.update({title: updateTitle})
            }
            if(updatePrice){
                product.update({price: updatePrice})
            }
            if(updateTags){
                product.update({tags: [updateTags]})
            }
        })
        .then(updatedProduct =>{
            res.send(updatedProduct);
        });
    });
    //curl -X DELETE http://localhost:3000/products/25
    app.delete('/products/:id', (req, res) => {
        const id = req.params.id;
        db.products.destroy({
            where: {id:id}
        })
        .then(deletedProduct =>{
            res.json(deletedProduct);
        });
    });


}