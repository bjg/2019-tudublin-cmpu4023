# Lab 1: REST API, SQL and ORM

This lab is split into two main sections, massive and sequelize. The files for each are located in their respective directories.

## Section 1: Massive

### Part 1: Massive endpoints

For this part, several rest endpoints were implemented. Example output from these can be found in [massive/endpoints-curl-output.txt](massive/endpoints-curl-output.txt).

### Part 2: Query string and SQL injection

I updated the products endpoint to allow for searching using a query string. By poorly implementing it such that the query string is placed directly into the sql query, an sql injection attack can be performed on it. This endpoint can be found at /products-injection.

The URL I used to perform this attack is: http://localhost:3000/products-inject?name=Book%27;delete%20from%20purchase_items%20where%20id=3;--

Full output from this can be found in [massive/sql-injection.txt](massive/sql-injection.txt).

### Part 3: Protecting against SQL injection
 
I implemented two separate endpoints showing strategies to avoid this attack.

/products uses a parameterised query.

/products-function uses an SQL function.

The output from these can also be found in [massive/sql-injection.txt](massive/sql-injection.txt).

## Section 2: Sequelize

### Part 4: Sequelize setup

I made use of sequelize-auto to automatically generate the model files. I also added `underscored: true` and `timestamps: false` to each model to deal with errors relating to camel case and the timestamp columns respectively.

The model files can be found in [sequelize/server/models](sequelize/server/models).

To generate the migration file, I used sequelize-auto-migrations. This is located here: [sequelize/server/migrations/1-pgguide-migration.js](sequelize/server/migrations/1-pgguide-migration.js).

### Part 5: Populating the database

I used seeds to populate the database. These files can be found in [sequelize/server/seeders](sequelize/server/seeders).

To apply these, run the command `./node_modules/.bin/sequelize db:seed:all`

### Part 6: Sequelize endpoints

I re-implemented the endpoints from the massive section, as well as adding the 3 new endpoints for modifying products (adding/updating/deleting). These new endpoints return 200 on success, or 400 on error.

Output from these endpoints can be found in [sequelize/endpoints-curl-output.txt](sequelize/endpoints-curl-output.txt).

