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

 app.post('/contact/update/:id', function(req, res){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var phoneno = req.body.phoneno;
    var id = req.params.id;

    var contact = new Contact();
    contact._id = id;
    contact.firstname = firstname;
    contact.lastname = lastname;
    contact.phoneno = phoneno;
    contact.update({firstname:firstname,lastname:lastname, phoneno:phoneno}, function(err, contact){
      if(err) return err;

      req.flash("success_msg", "Contact Successfully updated");
      res.redirect('/table');
    })
 })

 app.get('/delete/contact/:id', function(req, res){

   Contact.find({id:req.params.id}, function(err, contact) {
  if (err) throw err;
  // delete sms
  var contact = new Contact();
  contact._id = req.params.id;
  contact.remove(function(err) {
 if (err) throw err;
  req.session.oldUrl = req.url;
  req.flash('success_msg', 'Contact removed succesfully.' );
  res.redirect('/table');
 });
 });

 })

 app.post('/contact/new/:id', function(req, res){
   var user = req.params.id;
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
       res.redirect('/aspirant')
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
          res.redirect('/aspirant')
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
