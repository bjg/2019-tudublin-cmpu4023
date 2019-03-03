const express = require('express');
const crypto = require('crypto');
const router = express.Router();

/*
    access_key = 4313396EE85C7E8466883FE4A39BEDC0F0EE1C44BA123 // 45 length 160 bits
    secret_key = 1847AB149BB3BDE88F33865DDF5BAEE6C2A0B9261DD2D39D53B1931F03486EEA785783239913FADD // 80 length 320 bits
*/

router.post('/', (req, res) => {
    console.log(JSON.stringify(req.body));

    req.app.get("db").users.findOne({
        access_key: req.body.access_key
    })
        .then(result => {
            const client_signature = req.body.signature;
            const hmac = crypto.createHmac("sha256", result.secret_key);

            hmac.update(req.body.access_key + req.body.message);

            const server_signature = hmac.digest("hex");
            console.log("Server Signature: " + server_signature);
            console.log("Client Signature: " + req.body.signature);

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