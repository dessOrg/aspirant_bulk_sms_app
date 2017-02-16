var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logSchema = mongoose.Schema({

  sms : {
    type :  String
  },
  logstr : {
    type : Array
  },
  user :{
    type : Schema.Types.ObjectId, ref: "User"
  }
});

var logSchema = module.exports = mongoose.model('Log', logSchema);
