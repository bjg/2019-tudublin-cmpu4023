exports.getAllProducts = (req, res) => {
  req.app.get('db').products.find({})
  .then(items => {
    res.status(200).json({
        "status": "Ok",
        "message": "Product Controller",
        "data": items
      });
  }).catch(error => {
    console.error(error);
    res.status(500).json({
        "status": "Error",
        "message": "An error has occured, please try again"
      });
  });
};
