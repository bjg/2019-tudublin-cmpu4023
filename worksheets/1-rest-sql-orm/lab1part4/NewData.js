/**
 * this script is for Problem set 5 - NOTE: this script has been integrated to the index.js in routes
 * Use your models and Javascript code to populate the database with some additional test data for all of the models above
 * 
 * 
 */

 // import models
 //MODELS
const usersObj = require('../models/users');
const Users = usersObj.get('Users');

const productsObj = require('../models/products');
const Products = productsObj.get('Products');

const purchasesObj = require('../models/purchases');
const Purchases = purchasesObj.get('Purchases');

const purchase_itemsObj = require('../models/purchase_items');
const Purchase_items = purchase_itemsObj.get('Purchase_items');

// Functions to create new data - I will pass parameters of data into each function to create a new data row
function create_user(email,password,details){

    User.create({ email: email, password: password, details: details })
    //checking it doesnt already exist
  .then(() => User.findOrCreate({where: {email: email, password: password, details: details}}))
  .spread((user, created) => {
    console.log(user.get({
      plain: true
    }))
    console.log(created);
  })

}


function create_product(title,price,tags){
    Products.create({ title:title,price:price,tags:tags })
    //checking it doesnt already exist
  .then(() => Products.findOrCreate({where: {title:title,price:price,tags:tags}}))
  .spread((products, created) => {
    console.log(products.get({
      plain: true
    }))
    console.log(created);
  })

}


function create_purchases(name,address,state,zipcode,user_id){
    Purchases.create({ name:name,address:address,state:state,zipcode:zipcode,user_id:user_id })
    //checking it doesnt already exist
  .then(() => Purchases.findOrCreate({where: {name:name,address:address,state:state,zipcode:zipcode,user_id:user_id}}))
  .spread((purchases, created) => {
    console.log(purchases.get({
      plain: true
    }))
    console.log(created);
  })

}


function create_purchase_items(purchase_id,product_id,price,quantity,state){
    Purchase_items.create({ purchase_id:purchase_id,product_id:product_id,price:price,quantity:quantity,state:state })
    //checking it doesnt already exist
  .then(() => Purchase_items.findOrCreate({where: {purchase_id:purchase_id,product_id:product_id,price:price,quantity:quantity,state:state}}))
  .spread((purchase_items, created) => {
    console.log(purchase_items.get({
      plain: true
    }))
    console.log(created);
  })

}


//Calling models to create data
create_user('strong.erik@gmail.com','password123',{sex:'M'});
create_product("Drum Kit", 1500.00, ["music","instrument","drums"] );
create_purchases("Eric Strong","19 Riversdale Palmerstown","DU",01,51); // Eric is user 51. this may need to be dynamic
create_purchase_items( 1001, 24, 1500.00 ,1 , "Pending" ); // purchase_id 1001 , product_id 24 price 1500, quant 1 this may need to be dynamic