var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var manifestoSchema = mongoose.Schema({

  title : {
    type :  String
  },
  user :{
    type : Schema.Types.ObjectId, ref: "User"
  }
});

var manifestoSchema = module.exports = mongoose.model('Manifesto', manifestoSchema);
