const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Bachelier = require('../Models/Bachelier');
const Formateur = require('../Models/Formateur');
const Admin = require('../Models/Admin');
const config = require('../config/database');

// To authtenticate the User by JWT Startegy
module.exports = (userType, passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        if (userType == 'formateur') {
            Formateur.getFormateurById(jwt_payload.data._id, (err, user) => {
                if (err) return done(err, false);
                if (user) return done(null, user);
                return done(null, false);
            });
        }
        if (userType == 'bacheliers') {
            Bachelier.getBachelierById(jwt_payload.data._id, (err, user) => {
                if (err) return done(err, false);
                if (user) return done(null, user);
                return done(null, false);
            });
        } 
        if (userType == 'admins') {
            Admin.getAdminById(jwt_payload.data._id, (err, user) =>{
                if (err) return done (err, false);
                if(user) return done (null, user);
                return done(null, false);
            });
        }
        
        
    }));
}