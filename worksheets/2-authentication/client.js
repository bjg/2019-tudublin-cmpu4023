const crypto = require('crypto');

var signature = crypto.createHmac('sha256', "4DklrPkKmmk6GFVK5LoYAZ_PevaUx0U56oNB7HxrAvICMTZZ_rJ3NA==").update("Python Book").digest('hex')

console.log(signature)