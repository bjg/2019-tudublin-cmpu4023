# Worksheet 1
This labsheet is broken into two seperate folders one for massive.js and one for sequilize

## Massive
### Part 1: EndPoints
GET /users 
List all users email and sex in order of most recently created. Do not include password hash in your output
![alt text](https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Massive/images/users.png "Image of users Query raw")
![alt text][users_pp]

GET /users/:id

GET /products List all products in ascending order of price ![al
Show above details of the specified user
![alt text][users_id]


GET /products
List all products in ascending order of price
![alt text][products]
![alt text][products_pp]

GET /products/:id
Show details of the specified products
![alt text][products_id]


GET /purchases
List purchase items to include the receiver’s name and, address, the purchaser’s email address and the price, quantity and delivery status of the purchased item. Order by price in descending order

[users]: 
[users_pp]: https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Massive/images/users_pp.png "Image of users Query pretty printed"
[users_id]: https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Massive/images/users_id_pp.png "Image of users/:id Query pretty printed"
[products]: https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Massive/images/products_raw.png "Image of products query raw format"
[products_pp]: https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Massive/images/products_pp.png "Image of products query pp format"
[products_id]: https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Massive/images/products_id_pp.png "Image of products/:id query pp format"
