var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bulkSchema = mongoose.Schema({

  sms : {
    type :  String
  },
  user :{
    type : Schema.Types.ObjectId, ref: "User"
  }
});

var bulkSchema = module.exports = mongoose.model('Bulk', bulkSchema);
