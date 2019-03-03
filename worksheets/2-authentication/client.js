const crypto = require('crypto');
const secret = 'verysecretkey';
const hmac = crypto.createHmac('sha256', secret).digest("hex");
const request = require("request")
//hmac question - part 4

var header =
{
    'x-signature': hmac
};

var options =
{
    url: 'http://localhost:3000/api/hmac',
    method:'GET',
    headers: header,
}

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200)
    {
        console.log(body);
    }
    else
    {
      console.log(error);
    }
})



//hmac.update('some data to hash');
//console.log(hmac.digest('hex'));
