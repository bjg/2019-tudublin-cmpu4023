    /*  PROBLEM SET 6   */ 
'use strict'

/*  
      1. curl http://localhost:3000/products
      2. curl http://localhost:3000/products/8
      3. curl --data "title=Apple%20Pods&price=35.99&tags=Audio" http://localhost:3000/products
      4. curl -X PUT -d "title=Headphones&price=13.01" http://localhost:3000/products/27
      5. curl -X DELETE http://localhost:3000/products/25
*/

module.exports = (app, db) => {

    // 1. GET /products[?name=string]
  app.get('/products', (req, res) => 
  {   
      if(req.query.name) {
      const p_name = req.query.name;
      db.products.findAll(
        {
            where: { 
                title: p_name
            }}
      )
      .then( response =>{  res.json(response);
      });
    } else {
    // otherwise, GET all /products 
        db.products.findAll()
        .then(response => res.json(response))
    }
  })

  
    // 2. GET /products/:id
  app.get('/products/:id', (req, res) =>{
      const id = req.params.id;
      db.products.findOne({
          where:{
              id: id
            }
        })
        .then(response => res.json(response))
  })

  
    // 3. POST /products
  app.post('/products', (req, res) => {
    const title = req.body.title;
    const price = req.body.price;
    const tags = req.body.tags;
    db.products.create({
        title: title, 
        price: price, 
        tags: [tags]
    })
    .then(response => { res.json(response) })
  })


    // 4. PUT /products/:id
  app.put('/products/:id', (req, res) => {
    const p_id = req.params.id;
    const title = req.body.title;
    const price = req.body.price;
    const tags = req.body.tags;

    db.products.findOne({
        where: {
            id: p_id
        }
    })
    .then(product =>{
        if(title){
            product.update({title: title})
        }
        if(price){
            product.update({price: price})
        }
        if(tags){
            product.update({tags: [tags]})
        }
    })
    .then(response =>{ res.send(response);
    });
  })


    // 5. DELETE /products/:id 
  app.delete('/products/:id', (req, res) => {
    const p_id = req.params.id;
    db.products.destroy({
        where: {
            id: p_id
        }
    }).then(response => res.json(response));
  })


}

