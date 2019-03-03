module.exports = (app, db) => {
  app.get("/products", (req, res) =>
    db.products.findAll().then((result) => {console.log(result); res.json(result)})
  );

  app.get("/products/:id", (req, res) =>
    db.products.findById(req.params.id).then((result) => {console.log(result); res.json(result)})
  );

  app.delete( "/products/:id", (req, res) =>
    db.products.destroy({
      where: {
        id: req.params.id
      }
    }).then((result) => {res.json(result)})
  );

  app.post("/products", (req, res) => {
    console.log(req);
    db.products.create({
      title: req.body.title,
      price: req.body.price,
      id: 9111
    }).then((result) => {res.json(result)})
    }
  );

  app.put("/products/:id", (req, res) =>
    db.products.update({
      title: req.body.title,
      price: req.body.price
    },
    {
      where: {
        id: req.params.id
      }
    }).then((result) => {res.json(result)})
  );
}
