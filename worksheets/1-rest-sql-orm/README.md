# Part 1: Using Node, Express and Massive to create API endpoints:

### GET /users
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/1.1_displayUsersInfo.PNG "1.1_displayUsersInfo")

### GET /users/:id
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/1.2_displaySpecificUserInfoByID.PNG  "1.2_displaySpecificUserInfoByID")

### GET /products
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/1.3_allProductsDESC.PNG  "1.3_allProductsDESC")

### GET /products/:id
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/1.4_displaySpecificProductByID.PNG  "1.4_displaySpecificProductByID")

### GET /purchases
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/1.5_displayAllPurchaseItems.PNG  "1.5_displayAllPurchaseItems")

# Part 2: Extend the '/products' Endpoint to Allow SQL Injection

### GET /products[?name=string] - Possible SQL Injection
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/2_getProductByID_SQLinjection.PNG  "2_getProductByID_SQLinjection")

# Part 3: Extend /products Endpoint to Prevent SQL Injection

### GET /products[?name=string] - Parameterised Query
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/3.1_parameterisedQuery.PNG  "3.1_parameterisedQuery")

### GET /products[?name=string] - Stored Procedure
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/3.2_storedProcedure.PNG  "3.2_storedProcedure")

# Part 4: Model Database and Migrate using Sequelize ORM

### Model and Migrate Users Table
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/4_modelUsers.PNG  "4_modelUsers")

![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/4_migrateUsers.PNG  "4_migrateUsers")

### Model and Migrate Products Table
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/4_modelProducts.PNG  "4_modelProducts")
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/4_migrateProducts.PNG  "4_migrateProducts")

### Model and Migrate Purchases Table
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/4_modelPurchases.PNG  "4_modelPurchases")

![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/4_migratePurchases.PNG  "4_migratePurchases")

### Model and Migrate Purchase_Items Table
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/4_modelPurchaseItems.PNG  "4_modelPurchaseItems")

![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/4_migratePurchaseItems.PNG  "4_migratePurchaseItems")

# Part 5: Using Models and JS to Perform Bulk Inserts

### Inserts and Delete of bulk data were performed using seeder files and see commands: 
```
db:seed:all
db:seed:undo:all
```

### Seed Files for Users Table
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/5_bulkInsertsUsers.PNG  "5_bulkInsertsUsers")

### Seed Files for Products Table
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/5_bulkInsertsProducts.PNG  "5_bulkInsertsProducts")

### Seed Files for Purchases Table
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/5_bulkInsertsPurchases.PNG  "5_bulkInsertsPurchases")

### Seed Files for Purchase_Items Table
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/5_bulkInsertsPurchaseItems.PNG  "5_bulkInsertsPurchaseItems")

# Part 6: Reimplemented RESTful API using Sequelize and Express

### GET /products
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/6.1_listAllProducts.PNG  "6.1_listAllProducts")

### GET /products/:id
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/6.2_displaySpecificProductByID.PNG  "6.2_displaySpecificProductByID")

### POST /products
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/6.3_createNewProduct.PNG  "6.3_createNewProduct")

### POST /products/:id
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/6.4_updateExistingProduct.PNG  "6.4_updateExistingProduct")

### DELETE /products/:id
![alt text](https://github.com/nicolamahon/2019-tudublin-cmpu4023/blob/C15755031-wks-1/worksheets/1-rest-sql-orm/screenshots/6.5_deleteExistingProduct.PNG  "6.5_deleteExistingProduct")
