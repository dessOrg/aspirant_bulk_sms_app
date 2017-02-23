var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logSchema = mongoose.Schema({

  sms : {
    type :  String
  },
  cost : {
    type : String
  },
  number : {
    type : String
  },
  date : {
    type : Date
  },
  status : {
    type : String
  },
  user :{
    type : Schema.Types.ObjectId, ref: "User"
  }
});

var logSchema = module.exports = mongoose.model('Log', logSchema);
