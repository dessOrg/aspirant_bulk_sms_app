var Bulk = require('../models/sms');
var Contact = require('../models/contacts');
var Log = require('../models/logs');
var Balance = require('../models/tokens');


// We need this to build our post string
var querystring = require('querystring');
var https       = require('https');

module.exports = function(app){

  // africastalking user credentials
  var username = 'desshub';
  var apikey   = 'b8a87060086b16297c5ebe5190964f09fd258ec51a969ad88cd8c131243ef8fc';

  app.post('/text/new', function(req, res){
    var user = req.user;
    var sms = req.body.sms;

      var bulk = new Bulk();
           bulk.user = user;
           bulk.sms = sms;

         bulk.save(function(err, bulk){
           if (err) return err;

           console.log(bulk);
           req.flash('success_msg', 'Campaign Successfully  Created');
           res.redirect('/text')
         })

 })

 app.post('/text/update/:id', function(req, res){
   var id = req.params.id;
   var sms = req.body.sms;

     var bulk = new Bulk();
          bulk._id = id;

        bulk.update({sms:sms}, function(err, bulk){
          if (err) return err;

          console.log(bulk);
          req.flash('success_msg', 'Campaign Successfully  updated');
          res.redirect('/text')
        })

})

 app.get("/text", isLoggedIn, function(req, res) {
   var messages = ''
   Bulk.find({user:req.user}, function(err, bulks){
     if(err) return err;

     Balance.find({user:req.user}, function(err, tokens){
       if(err) return err;
     res.render("dashboard/text.ejs", {bulks:bulks, tokens:tokens} );
   })
   })

 })

 app.get("/user/sms/:id", isLoggedIn, function(req,res){
   var message= '';
   var contact = [];
   var logStr  = [];
   var id = req.params.id;
   console.log(id)
   Bulk.find({_id:id}, function(err, bulk){
     if(err) return err;

     for(i=0; i<bulk.length; i++){
        message = bulk[i].sms;
     }
    console.log(message)
     Contact.find({user:req.user}, function(err, contacts){
       if(err) return err;

       var count = 0;

       if(contacts.length==0){
         res.redirect('/table')
       }else {
        Balance.find({user:req.user}, function(err, balance){
          if(err) return err;

          var bal = 0;
          for(i=0; i<balance.length; i++){
            bal += balance[i].tokens;
          }
          if(contacts.length>bal){
            var diff = contacts.length-bal;
            var flash = "Insufficient tokens, add " + diff +" to proceed";
            req.flash("error_msg", flash);
            res.redirect('/text');
          }else {
            for(i=0; i<contacts.length; i++){


                 // Define the recipient numbers in a comma separated string
                 // Numbers should be in international format as shown
                 var to      = contacts[i].phoneno;

                 // And of course we want our recipients to know what we really do
                 //message = msg;

                 // Build the post string from an object

                 var post_data = querystring.stringify({
                     'username' : username,
                     'to'       : to,
                     'message'  : message
                 });

                 var post_options = {
                     host   : 'api.africastalking.com',
                     path   : '/version1/messaging',
                     method : 'POST',

                     rejectUnauthorized : false,
                     requestCert        : true,
                     agent              : false,

                     headers: {
                         'Content-Type' : 'application/x-www-form-urlencoded',
                         'Content-Length': post_data.length,
                         'Accept': 'application/json',
                         'apikey': apikey
                     }
                 };

                 var post_req = https.request(post_options, function(res) {
                     res.setEncoding('utf8');
                     res.on('data', function (chunk) {
                         var jsObject   = JSON.parse(chunk);
                         var recipients = jsObject.SMSMessageData.Recipients;
                         var log = []
                         if ( recipients.length > 0 ) {
                             for (var i = 0; i < recipients.length; ++i ) {
                                 var str  = 'number=' + recipients[i].number;
                                 str     += ';cost='   + recipients[i].cost;
                                 str     += ';status=' + recipients[i].status; // status is either "Success" or "error message"

                                 var number = recipients[i].number;
                                 var cost = 1.5000;
                                 var status = recipients[i].status;
                                 }

                                 var log = new Log();
                                 log.date = Date();
                                 log.sms = message;
                                 log.cost = cost;
                                 log.number = number;
                                 log.status = status;
                                 log.user = req.user;
                                 log.save(function(err, log){
                                   if(err) return err;
                                   console.log(log);

                                 })

                             } else {
                                  var error = 'Error while sending: ' + jsObject.SMSMessageData.Message;
                                 console.log(error);
                                 req.flash('error_msg', error);
                         }


                     });
                 });

                 // Add post parameters to the http request
                 post_req.write(post_data);

                 post_req.end();
                   }
                   res.redirect('/text')
          }
        })






           }

        //Call sendMessage method
        //sendMessage();

     })
   })
 })


}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/');
}
