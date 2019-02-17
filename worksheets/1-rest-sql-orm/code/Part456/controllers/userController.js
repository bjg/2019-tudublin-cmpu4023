const User = require('../config.js').user;

exports.create = (user, res) => {
    
    /* Validate Input */
    if(user.email == null){
        res.send('Email must be specified for User'); 
        return;
    }
    
    User.create({
        email: user.email,
        password: user.password,
        details: user.details
    }, {
        fields: ['email', 'password', 'details']
    }).then( user => {
        res.send( JSON.stringify(user, null, 2) );
    });
};

exports.findAll = (req, res) => {
    User.findAll({
        // Don't show hashed password
        attributes: ['id', 'email', 'details']
    }).then(users => {
        res.send( JSON.stringify( users, null, 2 ) );
    });
};

exports.findByPk = (req, res) => {
    User.findOne({ 
        where: { id: req.params.id },
        // Don't show hashed password
        attributes: ['id', 'email', 'details']
    }).then(user => {
            res.send( JSON.stringify( user, null, 2 ) );
    });
};
