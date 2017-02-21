var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tokenSchema = mongoose.Schema({

  tokens : {
    type :  String
  },
  amount : {
    type : String
  },
  code : {
    type :  String
  },
  date : {
    type : Date
  },
  phoneno : {
    type : String
  },
  user :{
    type : Schema.Types.ObjectId, ref: "User"
  }
});

var tokenSchema = module.exports = mongoose.model('Token', tokenSchema);
