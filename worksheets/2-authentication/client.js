/* this is the client */ 

http = require("http");
crypto = require("crypto");
const express = require('express');
const jwt = require('jsonwebtoken');
const massive = require('massive');
var HmacAuth = require('hmac-authentication');
var app = express();



message = "hello world"
accesskey = 12345678998765323549
var ts = Math.floor(new Date() / 1000)
 var body = accesskey + message + ts;

//generating the signature
signature = crypto.createHmac("sha256", body).digest("hex");

http.get({
    port:  3000,
    headers: {
     "Signature": signature
   }
},function (res) {

    
//print repsonse
res.on("data", function(data) {
    console.log(data.toString());
    })
});




