const Product = require('../models').Product;

module.exports = {
  create(req, res) {
    return Product
      .create({
        title: req.body.title,
		price: req.body.price,
		tags:req.body.tags,
      })
      .then(product => res.status(201).send(product))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
  return Product
    .findAll({where: req.query})
    .then(products => res.status(200).send(products))
    .catch(error => res.status(400).send(error));
},
retrieve(req, res) {
  return Product
    .findById(req.params.productId, {
      })
    .then(product => {
      if (!product) {
        return res.status(404).send({
          message: 'Product Not Found',
        });
      }
      return res.status(200).send(product);
    })
    .catch(error => res.status(400).send(error));
},
update(req, res) {
  return Product
    .findById(req.params.productId, {
      })
    .then(product => {
      if (!product) {
        return res.status(404).send({
          message: 'Product Not Found',
        });
      }
      return product
        .update({
          title: req.body.title || product.title,
        })
        .then(() => res.status(200).send(product))  
        .catch((error) => res.status(400).send(error));
    })
    .catch((error) => res.status(400).send(error));
},
destroy(req, res) {
  return Product
    .findById(req.params.productId)
    .then(product => {
      if (!product) {
        return res.status(400).send({
          message: 'Product Not Found',
        });
      }
      return product
        .destroy()
        .then(() => res.status(204).send())
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
},
};