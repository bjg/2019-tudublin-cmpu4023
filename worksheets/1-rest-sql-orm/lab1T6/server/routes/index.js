const productsController = require('../controllers').products;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the product API!',
  }));

  app.post('/api/products', productsController.create);
  app.get('/api/products', productsController.list);
  app.get('/api/products/:productId', productsController.retrieve);
  app.put('/api/products/:productId', productsController.update);
  app.delete('/api/products/:productId', productsController.destroy);
};