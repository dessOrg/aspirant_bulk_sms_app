var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({

  username :{
    type : String,
    index : true
  },
  lastname :{
    type : String
  },
  firstname : {
    type :  String
  },
  gender : {
    type :  String
  },
  party : {
    type :  String
  },
  slogan : {
    type :  String
  },
  bio : {
    type :  String
  },
  email : {
    type : String
  },
  phoneno  : {
    type : String
  },
  constituency : {
    type : String
  },
  ward : {
    type : String
  },
  county : {
    type : String
  },
  post : {
    type : String
  },
  picture : {
    type : String
  },
  role :{
    type :  String
  },
  password : {
    type : String
  }

});

var User = module.exports = mongoose.model('User', UserSchema);
module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10,function(err, salt){
    bcrypt.hash(newUser.password, salt, function(err, hash){
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}
module.exports.getUserByUsername = function(username, callback){

  User.findOne({phoneno:username}, callback);
}
module.exports.getUserByPhoneno = function(phoneno, callback){

  User.findOne({phoneno:phoneno}, callback);
}
module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}
module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if(err) throw err;
    callback(null, isMatch);
  });
}
