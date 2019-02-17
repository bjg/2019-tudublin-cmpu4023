const db = require('./sequelize');

db.models.Product.create({
    title: 'dummy title',
    tags: ['dummy', 'dummy'],
    price: 23
})
.catch(err => console.log(err))

db.models.Users.create({
    email: 'dummy@gmail.com',
    password: 'dummyPassword',
    details: {sex: "M"}
})
.catch(err => console.log(err))


db.models.Purchases.create({
    name: 'dummy name',
    address: 'dummy address',
    state: "dd",
    zipcode: 222,
    user_id: 2
})
.catch(err => console.log(err))

db.models.PurchaseItems.create({
    purchase_id: 5,
    product_id: 2,
    price: 2222,
    quantity: 5,
    user_id: 2,
    state: "Delivered"
})
.catch(err => console.log(err))



