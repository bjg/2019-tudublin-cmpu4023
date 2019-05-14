# Question 1:
## (1.0) - GET /users
### Code
app.get('/users', (req, res) => {req.app.get("db").query('select email, details from users order by created_at desc;').then(items => {
res.json(items);});});
### Output
![Image](worksheets/1-rest-sql-orm/screenshots/q1.0.PNG)

## (1.1) - GET /users/:id
### Code
app.get('/users/:id', (req, res) => {
	var id = req.params.id;
	req.app.get("db").query('select email, details from users where id = ${id} order by created_at desc;',
		{id : req.params.id}).then(items => {
res.json(items);});});
### Output
![Image](worksheets/1-rest-sql-orm/screenshots/q1.1.PNG)

## (1.2) - GET /products
### Code
app.get('/products', (req, res) => {req.app.get("db").query('select * from products order by price asc;').then(items => {
res.json(items);});});
### Output
![Image](worksheets/1-rest-sql-orm/screenshots/q1.2.PNG)

## (1.3) - GET /products/:id
### Code
app.get('/products/:id', (req, res) => {
	var id = req.params.id;
	req.app.get("db").query('select * from products where id = ${id} order by price asc;',
		{id : req.params.id}).then(items => {
res.json(items);});});
### Output
![Image](worksheets/1-rest-sql-orm/screenshots/q1.3.PNG)

## (1.4) - GET /purchases
### Code
app.get('/purchases', (req, res) => {req.app.get("db").query('select name, address, email, price, quantity, p.state from purchases join users on user_id=users.id join purchase_items p on purchases.id = purchase_id order by price desc;').then(items => {
res.json(items);});});
### Output
![Image](worksheets/1-rest-sql-orm/screenshots/q1.4.PNG)


## (2.0) - SQL injection
### Weak exploitable code
![Image](worksheets/1-rest-sql-orm/screenshots/q2_code.PNG)
### Injection
![Image](worksheets/1-rest-sql-orm/screenshots/q2_injection.PNG)
### Table after sql injection (id=1 from table products has been deleted)
![Image](worksheets/1-rest-sql-orm/screenshots/q2_table_rows_after_injection.PNG)

## (3.0) - Solution to injects
### Injection to test solutions
![Image](worksheets/1-rest-sql-orm/screenshots/q3_sql_inject.PNG)
### Solution 1 - parameterisation
#### Code
![Image](worksheets/1-rest-sql-orm/screenshots/q3_solution1_parameterisation_code.PNG)
#### After inject (no deletion)
![Image](worksheets/1-rest-sql-orm/screenshots/q3_solution1_parameterisation_after_inject.PNG)

### Solution 2 - stored procedure
#### Procedure
![Image](worksheets/1-rest-sql-orm/screenshots/q3_solution2_storedprocedure.PNG)
#### Code
![Image](worksheets/1-rest-sql-orm/screenshots/q3_solution2_storedprocedure_code.PNG)
#### After inject (no deletion)
![Image](worksheets/1-rest-sql-orm/screenshots/q3_solution1_parameterisation_after_inject.PNG)

## (4.0) - Database migration
#### Code for migration of purchases table (see migrations folder in sequelize part for all migrations)
![Image](worksheets/1-rest-sql-orm/screenshots/q4_purchase_items_migration_code.PNG)

## (5.0) - Population of databases useing JS code (seeds used, see seeds folder in sequelize part for all seeds)
#### Code for seed for users table insertion (inserts an email and password)
![Image](worksheets/1-rest-sql-orm/screenshots/q5_seed_insert_users_code.PNG)
### Insertion shown in table
![Image](worksheets/1-rest-sql-orm/screenshots/q5_seed_insert_users.PNG)

## (6.0) - GET /products[?name=string]
### Code
app.get('/products', (req, res) => {	
		Model.products.findAll({where:{title:{[Sequelize.Op.like]:"%"+req.query.name+"%"}}})
		.then(results => {
			res.json(results);})})
### Output
![Image](worksheets/1-rest-sql-orm/screenshots/q6.0.PNG)

## (6.1) - GET /products/:id
### Code
app.get('/products/:id', (req, res) => {
		Model.products.findOne({where:{id:req.params.id}})
		.then(results => {
			res.json(results);})})
### Output
![Image](worksheets/1-rest-sql-orm/screenshots/q6.1.PNG)

## (6.2) - POST /products
### Code
app.post('/products', (req, res) => {
	Model.products.create({title:req.body.title, price:req.body.price, tags: req.body.tags})
	.then(results => {
		res.json(results);})})
### Output 
![Image](worksheets/1-rest-sql-orm/screenshots/q6.2.PNG)
### After Insert
![Image](worksheets/1-rest-sql-orm/screenshots/q6.2_after_insert.PNG)
## (6.3) - PUT /products/:id
### Code
app.put('/products/:id', (req, res) => {
	Model.products.update({title: req.body.title, price: req.body.price, tags: req.body.tags},
	{where:{id:req.params.id}})
	.then(results => {
		res.json(results);})})
### Output (shows that the update has been carried out with new values)
![Image](worksheets/1-rest-sql-orm/screenshots/q6.3.PNG)

## (6.4) - DELETE /products/:id
### Code
app.delete('/products/:id', (req, res) => {
	Model.products.destroy({where:{id:req.params.id}})
	.then((results) =>{
		res.json(results)})})
### Output
![Image](worksheets/1-rest-sql-orm/screenshots/q6.4.PNG)
## After deteletion
![Image](worksheets/1-rest-sql-orm/screenshots/q6.4_after_deletion.PNG)
