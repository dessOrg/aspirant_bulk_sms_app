var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var balanceSchema = mongoose.Schema({

  tokens : {
    type :  String
  },
  phoneno : {
    type :  String
  },
  user :{
    type : Schema.Types.ObjectId, ref: "User",
    unique: "true"
  }
});

var balanceSchema = module.exports = mongoose.model('Balance', balanceSchema);
