const express = require('express');
const router = express.Router();
const db = require('../config/database');
const purchases = require('../models/purchases');
const products = require('../models/products');
const path = require('path');
//const bodyParser = require('body-parser')


//For Posts
var bodyParser = require('body-parser')
//router.use(bodyParser);
router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: false
}));
  
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//test route to tryout the post
router.post('/test', jsonParser, (req,res,next)=>{
  //console.log(req);
  //console.log(req.body);
  console.log(req.body.username);
});


//test2 
router.post('/test2', urlencodedParser, (req,res,next)=>{
  //console.log(req);
  //console.log(req.body);
  console.log(req.body.username);
});
//get all purchases
router.get('/purchased',(req, res) => 
purchases.findAll()
    .then(purchases => res.json(puchases))
)


//get products by id
router.get('/products/:id', function (req, res) {
    products.findAll({
    
        where:
        {
            id: req.params.id
        }
         
    }).then(products => res.json(products))
  });

// post test data

  router.post('/postproducts',jsonParser,(req,res,next)=>{
    console.log('calling post product')
   // req.setEncoding('UTF-16')
    console.log(req.body)

products.create({

    id:req.body.id,
    title:req.body.title,
    price: req.body.price,
    tags: req.body.tags
,
  })

  .then(product =>{
      res.send({
          status:200,
          product
      })
  })
  .catch(err => console.log(err))

});

//update title
router.put('/updatetitle/:id',jsonParser,(req,res,next)=>{
    console.log('calling post product')
   // req.setEncoding('UTF-16')
    console.log(req.body)

products.update({

    
    title:req.body.title

  },{
              
      where: {  
               id: req.params.id
             }
    }
  )

  .then(product =>{
      res.send({
          status:200,
          product
      })
  })
  .catch(err => console.log(err))

});

//delete data
router.delete('/deleteproduct/:id',jsonParser,(req,res,next)=>{
    
    console.log(req.body)

products.destroy({

              
      where: {  
               id: req.params.id
             }
    }
  )

  .then(product =>{
      res.send({
          status:200,
          product
      })
  })
  .catch(err => console.log(err))

});

router.get('/productsname/:title', function (req, res) {
    products.findAll({
    
        where:
        {
            title: req.params.title
        }
         
    }).then(products => res.json(products))
  });


module.exports = router;