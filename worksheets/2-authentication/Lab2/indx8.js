const bodyParser = require("body-parser");
const moment = require('moment');
const express = require('express');
const jwt = require('jsonwebtoken');
const massive = require('massive');
const crypto = require('crypto');
const port = 3000
const app = express();
app.use(bodyParser.json());

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'lab2',
  user: 'erika',
  password: '12ambionG'
}).then(instance => {
  app.set('db', instance);

// POST PRODUCTS
app.post('/hmac/products', async (req,res) =>{
  const accessKey = req.headers.access;
  db.query("select * from users where accesskey ='"+accessKey+"';")
  .then( user => {
    if (user[0] !== undefined){
      const _secretKey = user[0].secretkey; // getting user secret key from db
      const matches = checkHMAC(secret,req);
      if(matches === 200)
      {
        if((req.body.hasOwnProperty('name')&req.body.hasOwnProperty('price')))
        {
          db.query("INSERT INTO products(name,price) VALUES ($(_name),$(_price))", {_name:req.body.name,_price:req.body.price}).then(item =>{res.status(matches);
          }).catch(() => {return  res.status(401);})
        }
      }
    }})});

//GET PRODUCTS
app.get('/hmac/products', function(req,res){
  const accessKey = req.headers.access;
  if(accessKey == undefined){
    return  res.status(401);
  }else{
    db.query("SELECT name from products ORDER BY name ASC")
  }
});

function checkHMAC(secret,req){
  const signature = req.headers.signature;
  const accesskey = req.headers.access;

  const messageBody = JSON.stringify(req.body);
  console.log(messageBody);

  const bodymessage = (accesskey+messageBody);
  console.log(bodymessage);

  const compare = crypto.createHmac('SHA256',secret).update(bodymessage).digest('hex');
  console.log(compare);

  if(signature === compare)
  {return 200;}
  else{return 401;}
}
})

app.listen(port, () => console.log('Example app listening on port ${port}!'));