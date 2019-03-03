exports.getAllUsers = (req, res) => {
  req.app.get('db').users.find({})
  .then(items => {
    res.status(200).json({
        "status": "Ok",
        "message": "User Controller",
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
