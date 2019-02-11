## Documentation For Lab Exercises
This documentation is used to basically give evidence/justifications of endpoints and solutions working.

###Part 1:
These endpoints were implemented successfully. I had to select which values are to be returned for each one. For example the password hash is not returned. The user's gender is also selected by accessing it using JSON notation.

For finding all users, a user by ID, all products and a product by ID everything was pretty straight forward. The final part however required some JOINS to be done. After browsing on GitHub and Stackoverflow, I found out that JOINS etc are a "SQL" type operation and are best left to be executed as raw SQL. That is how that information is retrieved.

###Part 2:
For this part I had to update my previous endpoint by adding the name query parameter. The endpoint will check to see if it is present and if so it will then use it to find the product.

To achieve a badly implemented SQL version, I used a raw SQL query as I found that Massive.js protects against SQL injections by sanitising the data. I created a simple query:

"SELECT * FROM products WHERE title='"+req.query.name+"'"

This takes the query parameter and uses it to filter the results. By doing that, a malicious query can be made to do pretty much anything. To check to see if there is protection against SQL injections, a simple AND 1=1 query can be append and a 1=0 separately. If they return different things it is vulnerable.

The URL that can be entered in order to causes problems that I came up with is:

http://localhost:3000/products/Python Book'; DELETE FROM purchase_items WHERE product_id = 2; DELETE FROM products WHERE title = 'Python Book';

This removes foreign key dependencies and removes the book. By appending a '; to the end of the search string, literally any SQL query can then be made.

###Part 3:
The above solution is a badly designed one that allows for SQL injection. To prevent this, Massive.js was used and a parameterised query was used. To distinguish between the two endpoints with safe and unsafe implementations, I created:

/products-unsafe?name:string    (with the above implementation)
/products-safe?name:string      (with the next implementation)

The safe endpoint uses a parameterised query or a stored procedure. Both are there.

**Do stored procedure**

###Part 4:
For this, I created a new project named sequelize-project, this was to distinguish it from massive-project. I was unsure as to if new data was needed to be used so I could use singular names for my models, i.e Product, PurchaseItem, User etc, but to keep the original data I did the following:

Created matching models using the Sequelize CLI, edited them so they were correct and then migrating the changes. Sequelize provides an index file which basically gets all of the models and then returns them so that they can be used throughout the project. A SequelizeMeta table is added to (I assume) hold the internal meta data linked to Sequelize.

###Part 5:
**Note done yet**

###Part 6:
For this part I took a similar approach to part 1. I created the required Express endpoints but used models instead. To list all products you can use /products or give a query string to filter them by that name. Like part 1 you can also access products by ID.

To create a new product, a POST request is made to the /products endpoint. In order to handle POST data, I needed to explicity state that express was to use express.json() and express.urlencoded(). When this was done I fired up Postman and selected body and x-www-form-urlencoded as that was specified on Stackoverflow as the required option when using Express.

The required parameters are checked for by checking if the req.body object has each property and if it does then it continues, if not an error is sent back. The tags are sent as a string representation of an array and are then split by commas into a real array which is then saved to the database. A isoString representation of the date is also generated to the current time.

The PUT endpoint again is implemented with Express and is approached using Postman like above. Each parameter is checked for so that the user can change each individual parameter or all at once. Once updated a success message is returned.

The DELETE endpoint will use the ID and find the product, if it finds it, there will be an attempt to destroy it, if not an error is returned. It is then destroyed and if successful a success message will be returned, if not then an error will be returned.