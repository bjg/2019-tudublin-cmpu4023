/***
 *	Name: Gabriel Grimberg
 *	Module: Enterprise Application Development
 *	Lab: 2
 *	Questions: All
 *	Type: Routes"
 ***/

module.exports = app => {
        
    /**************
     * BASIC AUTH *
     **************/
    
    let landingRoute = require('./routes/routeLanding.js');
    let productRoute = require('./routes/routeProduct.js');
    
    /* -- Landing --*/
    app.route('/').get(landingRoute.landingPageResponse);
    
    /* -- Products with Basic Auth --*/
    app.route('/signin/products').get(productRoute.getProducts);
    
    /* --------------------------------------------------------- */
    
    /************
     * JWT AUTH *
     ************/
    
    let authJwt = require('./routes/routeJwtAuth.js');
    
    /* -- JWT Login --*/
    app.route('/signin/jwt/login').get(authJwt.authJwtFxn);
    
    /* -- Products with JWt Auth --*/
    app.route('/jwt/products').get(productRoute.getProducts);
    
    /* --------------------------------------------------------- */
    
    /*************
     * HMAC AUTH *
     *************/
    
    /* -- Products with JWt Auth --*/
    app.route('/hmac/products').get(productRoute.getProducts);
    
    /* --------------------------------------------------------- */
    
};
