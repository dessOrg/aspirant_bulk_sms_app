var Contact = require('../models/contacts');
var Balance = require('../models/tokens');

module.exports = function(app){

  app.post('/contact/new', function(req, res){
    var user = req.user;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var phoneno = req.body.phoneno;
     console.log(req.body.firstname)
    var messages = '';

    Contact.find({user:user, phoneno:phoneno }, function(err, contact){
      if(err) return err;
      if(contact.length>0){
        console.log(contact)
        req.flash("error_msg", "Phone No already exist")
        res.redirect('/table')
      }else{
      var contact = new Contact();
           contact.user = user;
           contact.firstname = firstname;
           contact.lastname = lastname;
           contact.phoneno = phoneno;
           console.log(phoneno)
         contact.save(function(err, contact){
           if (err) return err;

           console.log(contact);
           req.flash("success_msg", "Contact Created Successfully")
           res.redirect('/table')
         })
       }
    })

 })

 app.get("/table", function(req, res) {

      Contact.find({user:req.user}, function(err, contacts){
        if(err) return err;

        Balance.find({user:req.user}, function(err, tokens){
          if(err) return err;
        res.render("dashboard/table.ejs", {contacts:contacts, tokens:tokens});
      })
      })


 })

}
