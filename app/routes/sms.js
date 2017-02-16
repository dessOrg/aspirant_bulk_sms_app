var Bulk = require('../models/sms');
var Contact = require('../models/contacts');
var Log = require('../models/logs');


// We need this to build our post string
var querystring = require('querystring');
var https       = require('https');

module.exports = function(app){

  // Your login credentials
  var username = 'desshub';
  var apikey   = 'b8a87060086b16297c5ebe5190964f09fd258ec51a969ad88cd8c131243ef8fc';

  app.post('/text/new', function(req, res){
    var user = req.user;
    var sms = req.body.sms;

    var messages = '';

      var bulk = new Bulk();
           bulk.user = user;
           bulk.sms = sms;

         bulk.save(function(err, bulk){
           if (err) return err;

           console.log(bulk)
           messages = "Contact Created Successfully";
           res.redirect('/text')
         })

 })

 app.get("/text", isLoggedIn, function(req, res) {
   var messages = ''
   Bulk.find({user:req.user}, function(err, bulks){
     if(err) return err;
     res.render("dashboard/text.ejs", {bulks:bulks} );
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
                            log.push(str);
                            console.log(log);
                            }
                            logStr =log;
                            console.log(logStr)
                        } else {
                            console.log('Error while sending: ' + jsObject.SMSMessageData.Message);
                    }


                });
            });

            // Add post parameters to the http request
            post_req.write(post_data);

            post_req.end();
        }
        var log = new Log();
        log.sms = message;
        log.logStr = logStr;
        log.user = req.user;
        log.save(function(err, log){
          if(err) return err;
          console.log(log);
          res.redirect('/text')
        })
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
