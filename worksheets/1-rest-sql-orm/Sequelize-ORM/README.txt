-----------------------------------------------------------------

# Creating the Models. #

1. Products
node_modules/.bin/sequelize model:generate --name products --attributes title:string,price:float,created_at:date,deleted_at:date,tags:array:string,updated_at:date --underscored

2. Purchase Items
node_modules/.bin/sequelize model:generate --name purchase_items --attributes purchase_id:integer,product_id:integer,price:float,quantity:integer,state:string,updated_at:date --underscored

3. Purchases
node_modules/.bin/sequelize model:generate --name purchases --attributes created_at:date,name:string,address:string,state:string,zipcode:integer,user_id:integer,updated_at:date --underscored

4. Users
node_modules/.bin/sequelize model:generate --name users --attributes email:string,password:string,details:array:string,created_at:date,deleted_at:date,updated_at:date --underscored

-----------------------------------------------------------------

# Run Migration #

node_modules/.bin/sequelize db:migrate

-----------------------------------------------------------------

# Create Seeds #

1. Products
node_modules/.bin/sequelize seed:generate --name demo-product

2. Purchase Items
node_modules/.bin/sequelize seed:generate --name demo-purchase-item

3. Purchases
node_modules/.bin/sequelize seed:generate --name demo-purchase

4. Users
node_modules/.bin/sequelize seed:generate --name demo-user

-----------------------------------------------------------------

# Run All Test Data

node_modules/.bin/sequelize db:seed:all

-----------------------------------------------------------------

1. Run Product Test Data
node_modules/.bin/sequelize db:seed --seed 20190216121601-demo-product

2. Run User Test Data
node_modules/.bin/sequelize db:seed --seed 20190216121613-demo-user

3. Run Purchase Test Data
node_modules/.bin/sequelize db:seed --seed 20190216121609-demo-purchase

4. Run Purchase Item Test Data
node_modules/.bin/sequelize db:seed --seed 20190216121605-demo-purchase-item

-----------------------------------------------------------------