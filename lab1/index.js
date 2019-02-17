const express = require('express')
const massive = require('massive')
const app = express()
app.use(express.static('app/public'))
const port = 80

function getUsersInfo(user){
	
	let string = user.details;
						//console.log("This is the string : " + string)
	if(string){
		var index = string.indexOf("sex");
		if(index != -1){
			if(string.indexOf('=>"M"') != -1){
				user.details = "Male";
			}else if(string.indexOf('=>"F"') != -1){
				user.details = "Female";
			}
		}
	}else{
		user.details = "Sex : Unkown";
	}
	
	let tempDet = user.details;
	user.sex = tempDet;
	delete user.details;
	return user
}

massive({
  host: 'localhost',
  port: 5432,
  database: 'pgguide',
  user: 'postgres',
  password: 'password'
}).then(instance => {
	
        app.set('db', instance);
		
        app.get('/users', (req, res) => {
		
		let query = 'SELECT id, email,details from users ORDER BY created_at DESC';
		
		req.app.get('db').query(query).then(users => {
			
			users.forEach(function (user){
				user = getUsersInfo(user);
			});
			
			console.log(users);
			res.json(users)});
        });
		
		app.get('/users/:id', (req, res) => {
			let id = req.params.id;
			let query = "SELECT id,email,details FROM users WHERE id = '" + id + "'";
			req.app.get('db').query(query).then(users => {
				
				users.forEach(function (user){
					user = getUsersInfo(user);
				});
				console.log(users); 
				res.json(users)});
			});

		app.get('/products', (req, res) => {
		
		/*
			if(req.query.name != null){
				query = "SELECT * FROM products  WHERE title= '" + req.query.name + "'"

			}
			
			req.app.get('db').query(query).then(products => {
					res.json(products);
			});
			
		*/
		//let query = "SELECT * FROM products WHERE title = $1";
		
		//Stored Porcedure
		let query = "SELECT productbyname('" + req.query.name + "');
		
		req.app.get('db').query(query , [req.query.name]).then(products => {
					res.json(products);
			});
			
		});
		
	
        app.get('/products/:id', (req, res) => {
			
                query = "select * from products WHERE id= '" + req.params.id + "'" + " ORDER BY price ASC";

                req.app.get('db').query(query).then(products => {
                        res.json(products);
                });
        });



	app.get('/purchases', (req, res) => {
		
                query = "SElECT purchase_items.price, purchase_items.quantity, purchase_items.state, purchases.name AS RECEIVER_NAME"
				+ ", purchases.address AS RECEIVER_ADDRESS, users.email AS PURCHASERS_EMAIL from purchase_items " 
				+ "INNER JOIN PURCHASES ON (purchase_items.purchase_id=purchases.id) INNER JOIN USERS ON (purchases.user_id=users.id) ORDER BY price DESC";
		
                req.app.get('db').query(query).then(purchases => {
                        res.json(purchases);
                });
		
        });

        app.listen(port, () => console.log("Example app listening on port ${port}!"));
});


/*
CREATE OR REPLACE FUNCTION get_products(name VARCHAR(70)) RETURNS refcursor AS $$
DECLARE
    ref refcursor;
BEGIN
    OPEN ref FOR SELECT * FROM products WHERE title LIKE name;
    RETURN ref;
END;
$$ LANGUAGE plpgsql;

*/

