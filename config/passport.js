//config/passport.js
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function(passport) {

	//serialize user for session
	passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    //deserialize user and pass to template
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //pasport local
		passport.use(new LocalStrategy(
	  function(username, password, done) {
		  User.getUserByUsername(username, function(err, user){
		    if(err) throw err;
		    if(!user){
		      return done(null,false,{message:'Unknown user'});
		    }

		    User.comparePassword(password, user.password, function(err, isMatch){
		      if(err) throw err;
		      if(isMatch){
		        return done(null, user);
		      }
		      else{
		        return done(null, false,{message:'Invalid password'});
		      }
		    });
		  });
	  }));
}
