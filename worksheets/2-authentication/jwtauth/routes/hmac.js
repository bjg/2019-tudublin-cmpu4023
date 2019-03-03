const express = require("express")
const router = express.Router()
const crypto = require('crypto')

const hmac = crypto.createHmac("sha256", "secret key here");

/*tried my best to understand what was needed here
but was unable to figure it out completely
I think the concept is that the client signature needs to match
the server signature (which is made using the data sent across by the client)
but I was unsure how to do it/test it */

hmac.update("access key " + "message here")
const sign = hmac.digest("hex")


/* 
if (clientsign == sign){
	res.sendStatus(200)
} else {
	res.sendStatus(403)
}
module.exports = router;