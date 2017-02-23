var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = mongoose.Schema({

  firstname : {
    type :  String
  },
  lastname : {
    type :  String
  },
  phoneno  : {
    type : String
  },
  user :{
    type : Schema.Types.ObjectId, ref: "User"
  }
});

var contactSchema = module.exports = mongoose.model('Contact', contactSchema);
