//used to use the signature, if user dosnt have the proper access code in the envie file then the key cant be processed
//password gernerated from a sha-1 string run twice to make 360 bit
//Ali ens is the sha
const dotenv = require('dotenv');
dotenv.config();



const express = require('express');
const app = new express();


const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const parser = require('body-parser');

//using knex to connect instead of massive
const knex = require('knex');
const knexDB = knex({client: 'pg',
                    connection: {
                    host: '127.0.0.1',
                    port: 5432,
                    database: 'jwt_test',
                    user: 'postgres',
                    password: 'Waldo1997',//Put in password
    }
});




const bookshelf = require('bookshelf');
const securePassword = require('bookshelf-secure-password')
const db = bookshelf(knexDB);
db.plugin(securePassword);
const jwt = require('jsonwebtoken');

const User = db.Model.extend({
    tableName: 'login_user',
    hasSecurePassword: true
});

//Using the key
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_OR_KEY
  };

  const strategy = new JwtStrategy(opts, (payload, next) => {
    User.forge({ id: payload.id }).fetch().then(res => {
      next(null, res);
    });
  });

passport.use(strategy);
app.use(passport.initialize());
app.use(parser.urlencoded({
    extended: false
}));
app.use(parser.json());
  
app.post('/seedUser', (req, res) =>{
    if(!req.body.email || !req.body.password) {
        return res.state(401).send('no fields');
    }

    const User = new User({
        email: req.body.email,
        password: req.body.password
    });

    user.save().then(() => {res.send('ok');});
});

app.post('/getToken', (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(401).send('no fields');
    }
    User.forge({ email: req.body.email }).fetch().then(result => {
      if (!result) {
        return res.status(400).send('user not found');
      }

      result.authenticate(req.body.password).then(user => {
        const payload = { id: user.id };

        //using the secret key
        //using ENV as it excludes from the node modules  
        const token = jwt.sign(payload, process.env.SECRET_OR_KEY, {
            algorithm: 'HS256'
        });
        res.send(token);
      }).catch(err => {
        return res.status(401).send({ err });
      });
    });
  }
);

app.get('/getUser', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.send(req.user);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT);