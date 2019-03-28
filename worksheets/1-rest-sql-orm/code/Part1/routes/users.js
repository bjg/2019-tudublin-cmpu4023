var express = require('express');
var router = express.Router();

function parseDetailsString(user, index, arr)
{
    // Assigned default empty values if nothing is specified in the details part
    if(user.details == null || user.details == '')
    {
        arr[index] = { email: user.email, sex: '?' };
        return;
    }
    
    var genderStringIndex = user.details.indexOf('sex');
    
    if(genderStringIndex == -1)
    {
        arr[index] = { email: user.email, sex: '?' };
        return;
    }
    
    switch(user.details[genderStringIndex + 7])
    {
        case 'F':
            user.sex = 'F';
            break;
        case 'M':
            user.sex = 'M';
            break;
        default: 
            console.log('Skipping unknown gender attribute \'' + user.details[genderStringIndex + 7] + '\'');
            user.sex = '?';
    }
    
    arr[index] = { email: user.email, sex: user.sex };
}

var parseDetails = true;

/*  TEST
    curl localhost:3000/users    */
router.get('/', function(req, res, next) {
    req.app.get('db').users.find(
        {},
        {
            fields: ['email', "details"],
            order: [{
                field: 'created_at',
                direction: 'asc',
                nulls: 'last'
            }]
        }
    )
    .catch( err => { console.log('Failed to load users from DB'); })
    .then( users => {
        if(parseDetails)
            users.forEach(parseDetailsString);
        
        res.send( JSON.stringify(users, null, 2) );
        // res.render('userList', {root: users });
    } );
});

/*  TEST
    curl localhost:3000/users/1    */
router.get('/:id', function(req, res, next) {
    req.app.get('db').users.findOne(
        { id: req.params.id },
        {
            fields: ['email', "details", "id"]
        }
    )
    .catch( err => { console.log('Failed to load user from DB'); })
    .then( user => {
        
        if(user === null)
            res.render("userMessage", { message: "User not in database" });
        else
        {
            res.send( JSON.stringify(user, null, 2) );
            // res.render('userView', user);
        }
    } );
});

module.exports = router;
