const express = require('express');
const crypto = require('crypto');
const router = express.Router();

router.post('/', (req, res) => {
    req.app.get("db").users.findOne({
        access_key: req.body.access_key
    })
        .then(result => {
            const client_signature = req.body.signature;
            const hmac = crypto.createHmac("sha256", result.secret_key);

            hmac.update(req.body.access_key + req.body.message);

            const server_signature = hmac.digest("hex");
            console.log("Server Signature: " + server_signature);
            console.log("Client Signature: " + client_signature);

            if(client_signature !== server_signature){
                res.status(401);
                res.send("Invalid Signature");
                return;
            }

            req.app.get("db").query("select * from products")
                .then(items => {
                    res.status(201);
                    res.send( JSON.stringify(items, null, 2) );
                })
                .catch(error => {
                    console.log(error);
                    res.send("Failed to access db");
                });
        })
        .catch(error => {
            console.log(error);
            res.status(401);
            res.send(" Access key invalid");
        });
});


module.exports = router;