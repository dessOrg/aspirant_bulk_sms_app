var User = require('../models/user');
var Balance = require('../models/tokens');
var passport = require('passport');

module.exports = function(app) {

  app.get('/register', function(req, res){

    res.render('pages/register.ejs', {message:null});
  })

  app.post('/signup', function(req, res){
    var firstname=req.body.firstname;
      var lastname=req.body.lastname;
      var username=req.body.nickname;
      var gender=req.body.gender;
      var email=req.body.email;
      var phoneno=req.body.phoneno;
      var post=req.body.post;
      var county=req.body.county;
      var constituency=req.body.constituency;
      var ward=req.body.ward;
      var password=req.body.password;
      var password2=req.body.password2;
      var role = "normal"

      //validation
      req.checkBody('firstname','First Name is required').notEmpty();
      req.checkBody('lastname','Last Name is required').notEmpty();
      req.checkBody('nickname','Nickname is required').notEmpty();
      req.checkBody('phoneno','Phone number is required').notEmpty();
      req.checkBody('constituency','constituency is required').notEmpty();
      req.checkBody('ward','ward is required').notEmpty();
      req.checkBody('email','Email is required').notEmpty();
      req.checkBody('email','Email is not valid').isEmail();
      req.checkBody('password','Password is required').notEmpty();
      req.checkBody('password', 'Password should be 8 to 20 characters').len(8, 20);
      req.checkBody('password2','Passwords do not match').equals(req.body.password);


      var errors = req.validationErrors();
      console.log(errors)
      if (errors){
        var err = errors.msg;
        var utaken = errors;

          res.render('pages/register.ejs', {error : null,message: utaken});

      }else {

        User.getUserByUsername(phoneno, function(err, user){
      if(err) throw err;
      if(user){
          var errors = "";
          var msg = "";
          var utaken = "Mobile No exists in our system."

            res.render('pages/register.ejs', {error : null,message: utaken});
          }else{

              console.log('You have no register errors');
              var newUser=new User({
                firstname: firstname,
                lastname: lastname,
                username: username,
                gender: gender,
                email : email,
                phoneno: phoneno,
                post : post,
                constituency : constituency,
                ward : ward,
                county : county,
                password: password,
                role: role

          });
          User.createUser(newUser,function(err, user){
              if (err) throw err;

              req.login(user, function(err){
                    if(err) return err;
                    console.log(req.user);

                    var phone = '';
                    for(i=0; i<user.length; i++){
                      phone = user[i].phoneno;
                    }

                    var tokens = 5;
                    var balance = new Balance();
                    balance.tokens = tokens;
                    balance.phoneno = phone;
                    balance.user = req.user;

                    balance.save(function(err, token){
                      if(err) return err;

                      console.log(token);
                      res.redirect(req.session.returnTo || '/use')
                      delete req.session.returnTo;
                    })

                  });
            });

          console.log(newUser)
        }
      });
    }

  });

  app.get('/login', function(req,res){
    res.render("pages/login.ejs", {message:null})

  })

  app.post('/login', function(req, res, next) {
       passport.authenticate('local', function(err,user){
         if(err) return err;
         var message = {"msg":"Wrong Mobile No or Password"};
         if(!user){

           res.render('pages/login.ejs' , {message:message})
         }
         req.login(user, function(err){
           if(err) return err;
           res.redirect(req.session.returnTo || '/use')
           delete req.session.returnTo;


         });

   })(req,res,next);
 });

  app.get('/use', function(req,res){
    var user = req.user;
    var role = user.role;
    console.log(role)
    if(role =="admin"){
     res.redirect('/admin');
    }
    else if(role == "normal"){

       res.redirect('/dashboard');

    }
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
    /*
     since we're using friendly forwarding (see req.sessio.returnTo) when we
     logout the (req.session.returnTo variable will still be around,
    so we need to destroy it
    */

    req.session.destroy();
  });

};

module.exports.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/');
}
