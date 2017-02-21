var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = mongoose.Schema({

  code : {
    type :  String,
    unique: true
  },
  amount : {
    type : String
  },
  tokens : {
    type :  String
  },
  status : {
    type : String
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

var orderSchema = module.exports = mongoose.model('Order', orderSchema);
