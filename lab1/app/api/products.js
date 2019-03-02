module.exports = (app, db) => {
	//List all products
  app.get( "/products", (req, res) => 
		db.products.findAll().then( (result) => res.json(result) )
  );

	//Show specific productas
  app.get( "/products/:id", (req, res) =>
    db.products.findById(req.params.id).then( (result) => res.json(result))
  );
  
  //Create new product
  /*
  app.post("/products", (req, res) => 
    db.products.create({
      title: req.body.title,
	  price: req.body.price
    }).then( function(result){
		res.json(result);
	});
	);
*/

	app.post('/products', function (req, res) {
    db.products.create({
		//console.log(req.body);
        title: req.body.title,
        price: req.body.price
    }).then(function (products) {
        res.json(products);
    });
});

	//udpate new product instance
  app.put( "/products/:id", (req, res) =>
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

  app.delete( "/products/:id", (req, res) =>
    db.products.destroy({
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
  );
}