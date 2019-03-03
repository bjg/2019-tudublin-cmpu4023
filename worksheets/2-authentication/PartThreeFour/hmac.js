const express = require("express");
const http = require("http");
const massive = require("massive");
const bodyParser = require("body-parser");
const CryptoJS = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000

massive({
    host: 'localhost',
    port: 5432,
    database: 'labtwo',
    user: 'postgres',
    password: 'postgres',
    enhancedFunctions: true
  }).then(db => {
	  
    app.get('/', (req, res) => {
        res.send('/books');
    });

    //books endpoint calls the hmac authenticate middleware before running query
    app.post("/books", authenticate, (req, res) => {
        db.query(
            `SELECT * FROM BOOKS;`
        ).then(books => {
            //return books table
            res.status(200).send(books); 
        }) 
    });

	//Middleware
	function authenticate(req, res, next) {
		//pull key and sig from the client header
		header = req.headers.authorization;
		key = header.slice(16,26);
		signature = header.slice(37,);

        db.query(
            `SELECT public_key, private_key FROM USERS WHERE public_key = '${key}';`
        ).then(users => {
            public_key = users[0].public_key;
            private_key = users[0].private_key;
            url = "http://"+req.headers.host+req.url;
            body_data = req.body.value;

            const data = `${url}${body_data}${public_key}`;
            const signature = CryptoJS.HmacSHA256(data, private_key);
            newheader = `HMAC-SHA256 Key=${public_key} Signature=${Base64.stringify(signature)}`;

            //if the new header matches client to continue
            if(newheader == req.headers.authorization){
                next();
            }
            else{
                res.status(401).send("Authentication failed")
            }  
        })
    }
});
app.listen(port, () => console.log(`Part 4 (HMAC) on port ${port}`))
