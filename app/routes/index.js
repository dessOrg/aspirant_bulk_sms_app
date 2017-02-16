var User = require('../models/user');
var Contact = require('../models/contacts');

module.exports = function(app) {

  app.get('/', function(req,res){
    var messages = ""
    res.render('pages/index.ejs', {messages:messages});
  });

  app.get("/dashboard", isLoggedIn, function(req, res) {

     Contact.find({user:req.user}, function(err, contact){
       var count = contact.length;
       res.render("dashboard/index.ejs", {contacts:count});
     })

    })

    app.get("/chart", isLoggedIn, function(req, res) {
      res.render("dashboard/chart.ejs");
    })

    app.get("/form", isLoggedIn, function(req, res) {
      var messages = ''
      res.render("dashboard/form.ejs" );
    })





}


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/');
}
