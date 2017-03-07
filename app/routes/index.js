var User = require('../models/user');
var Contact = require('../models/contacts');
var Balance = require('../models/tokens');
var Log = require('../models/logs');
var Order = require('../models/orders');
var Manifesto = require('../models/manifesto');

module.exports = function(app) {

  app.get('/', function(req,res){

    res.render('pages/index.ejs', {message:null});
  });

  app.get('/aspirant', function(req,res){

   User.find({role:"normal"}, function(err, aspirants){
     if(err) return err;

     res.render('pages/aspirants.ejs', {aspirants:aspirants});
   })

  });

  app.post('/search', function(req, res){
    var post = req.body.post;
    var county = req.body.county;

    if(post == "All" && county == "All"){
      res.redirect('/aspirant');
    }else if(post == "All" && county != "All"){
      User.find({county:county}, function(err, aspirants){
        if(err) return err;

        res.render('pages/aspirants.ejs', {aspirants:aspirants});
      })
    }else if(county == "All" && post != "All"){
      User.find({post:post}, function(err, aspirants){
        if(err) return err;

        res.render('pages/aspirants.ejs', {aspirants:aspirants});
      })
    }else{
      User.find({county:county, post:post}, function(err, aspirants){
        if(err) return err;

        res.render('pages/aspirants.ejs', {aspirants:aspirants});
      })
    }


  })

  app.get('/profile/:id', function(req, res){
    var id = req.params.id;
    console.log(id);

    User.find({_id:id}, function(err, aspirant){
      if(err) return err;

     Manifesto.find({user:id}, function(err, manifestos){
       if(err) return err;

       console.log(aspirant);
       res.render('pages/profile.ejs', {aspirant:aspirant, manifestos:manifestos});
     })

    })
  })

  app.get("/dashboard", isLoggedIn, function(req, res) {

     Contact.find({user:req.user}, function(err, contact){
       var count = contact.length;

        Balance.find({user:req.user}, function(err, tokens){
          if(err) return err;

          Order.find({user:req.user}, function(err, orders){
            if(err) return err;

            Order.find({user:req.user, status:"pending"}, function(err, pending){
              if(err) return err;

              //console.log(pending)
              var pending = pending.length;
            Log.find({user:req.user}, function(err, messages){
              if(err) return err;

               var message = messages.length;

            res.render("dashboard/index.ejs", {contacts:count,tokens:tokens,orders:orders, messages:message, pending:pending});
          })
        })
        })

        })

     })

    })



    app.post('/token/order', function(req, res){

      var user = req.user;
      var plan = req.body.plan;
      var status = "pending";
      var code = req.body.code;
      var date = Date();

      Order.find({code:code}, function(err, order){
        if(err) return err;

        console.log(order.length);
        if(order.length>0){
          console.log(order)
          req.flash('err_msg', 'Code already used');
          res.redirect('/dashboard')
        }else{
          var order = new Order();
          order.user = user;
          order.code = code;
          order.plan = plan;
          order.status = status;
          order.date = date;
          order.phoneno = user.phoneno;
          order.save(function(err, order){
            if(err) return err;

            console.log('Order Successfully placed')
            req.flash('success_msg', 'Order Successfully placed');
            res.redirect('/dashboard');
          })
        }
      })
    })

    app.get("/chart", isLoggedIn, function(req, res) {

      var user = req.user

      Balance.find({user:user}, function(err, tokens){
        if(err) return err;

        Log.find({user:user}, function(err, logs){
          if(err) return err;

          console.log(logs)

          res.render("dashboard/chart.ejs", {tokens:tokens, logs:logs});
        })

    })
    })

    app.get("/admin/form", isLoggedIn, function(req, res) {
      var messages = ''
      Balance.find({user:req.user}, function(err, tokens){
        if(err) return err;

        Manifesto.find({user:req.user}, function(err, manifestos){
          if(err) return err;
          console.log(manifestos);
          res.render("dashboard/form.ejs", {tokens:tokens,manifestos:manifestos} );
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
