var User = require('../models/user');

module.exports = function(app) {

  app.get('/admin', isLoggedIn, isAdmin, function(req,res){
    var users = 0;
    User.find({role:"normal"}, function(err, count){
      if(err) return err;
      users = count.length
      var cont=[]
      for(i=0; i<users; i++){

         y=count[i].phoneno;
        cont.push(y);
        console.log(cont);

      }
      console.log(cont)
      res.render('admin/index.ejs', {users:users});
    })

  });

    app.get("/admin/chart", isLoggedIn, isAdmin, function(req, res) {
      res.render("admin/chart.ejs");
    })

    app.get("/404", function(req, res) {
      res.render("error/404.ejs");
    })

    app.get("/admin/form", isLoggedIn, isAdmin, function(req, res) {
      var messages = ''
      res.render("admin/form.ejs" );
    })

    app.get("/admin/table", isLoggedIn, isAdmin, function(req, res) {
      User.find({role:"normal"}, function(err, users){
        if(err) return err;

        res.render('admin/table.ejs', {users:users});
      })
    })

    app.get("/admin/signup", function(req, res) {
      var messages = ''
      res.render("pages/signup.ejs" );
    })

    app.post('/admin/signup', function(req, res){
      var firstname=req.body.firstname;
        var lastname=req.body.lastname;
        var username=req.body.username;
        var gender=req.body.gender;
        var email=req.body.email;
        var phoneno=req.body.phoneno;
        var password=req.body.password;
        var password2=req.body.password2;
        var role = "normal"

        //validation
        req.checkBody('firstname','First Name is required').notEmpty();
        req.checkBody('lastname','Last Name is required').notEmpty();
        req.checkBody('username','Username is required').notEmpty();
        req.checkBody('phoneno','Phone number is required').notEmpty();
        req.checkBody('email','Email is required').notEmpty();
        req.checkBody('email','Email is not valid').isEmail();
        req.checkBody('password','Password is required').notEmpty();
        req.checkBody('password', 'Password should be 8 to 20 characters').len(8, 20);
        req.checkBody('password2','Passwords do not match').equals(req.body.password);


        var errors = req.validationErrors();
        if (errors){
          var err = errors.msg;
          var utaken = "";
          console.log(errors)

            res.send(errors);

        }else {

          User.getUserByUsername(email, function(err, user){
        if(err) throw err;
        if(user){
            var errors = "";
            var msg = "";
            var utaken = "That email exists in our system."

              res.render('/errors/flash.ejs', {error : null,messages: utaken});
            }else{

                console.log('You have no register errors');
                var newUser=new User({
                  firstname: firstname,
                  lastname: lastname,
                  username: username,
                  gender: gender,
                  email : email,
                  phoneno: phoneno,
                  password: password,
                  role: role

            });
            User.createUser(newUser,function(err, user){
                if (err) throw err;
                req.login(user, function(err){
                      if(err) return err;
                      console.log(req.user);
                      res.redirect(req.session.returnTo || '/use')
                      delete req.session.returnTo;
                    });
              });

            console.log(newUser)
          }
        });
      }

    });



    //Admin can change roles for users via this route
    app.get('/role/:email/:role', function (req, res){
      var role = req.params.role;
        var email = req.params.email;
        User.getUserByUsername(email, function(err, user){
          if(err) return err;
          if(user){
            if(role == 'admin'){
              user.update({role:role}, function(err, user){
                if(err) return(err)
                res.redirect('/');
              });
            }
          }else{
            res.send("user does not exist");
          }
        });

    })



}


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/');
}

function isAdmin(req, res, next) {
  var user = req.user;
  if (user.role=="admin") {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/404');
}
