/***
 *	Name: Gabriel Grimberg
 *	Module: Enterprise Application Development
 *	Lab: 2
 *	Questions: All
 *	Type: Landing Route."
 ***/

const responseCode = require('../response/response.js');

exports.landingPageResponse = (req, res) => {
    res.write("Lab 2 - Parts 1-4 - Authentication - Gabriel Grimberg\n\n\n");
    res.write("------------- Part 1 -------------\n");
    res.write("http://localhost:3000/signin/products\n\n\n");
    res.write("------------- Part 2 -------------\n");
    res.write("http://localhost:3000/signin/jwt/login\n");
    res.write("http://localhost:3000/jwt/products\n\n\n");
    res.write("------------- Part 3 -------------\n");
    res.write("Extended the Users table with Key and Private Key\n\n\n");
    res.write("------------- Part 4 -------------\n");
    res.write("http://localhost:3000/hmac/products\n");
    res.end()
};
