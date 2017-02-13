var User = require('../models/user');

module.exports = function(app) {

  app.get('/', function(req,res){
    var messages = ""
    res.render('pages/index.ejs', {messages:messages});
  });

  app.get("/dashboard", isLoggedIn, function(req, res) {

      res.render("dashboard/index.ejs");
    })

    app.get("/chart", isLoggedIn, function(req, res) {
      res.render("dashboard/chart.ejs");
    })

    app.get("/form", isLoggedIn, function(req, res) {
      res.render("dashboard/form.ejs");
    })


    app.get("/table",isLoggedIn, function(req, res) {

        res.render("dashboard/table.ejs");


    })

}


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/');
}
