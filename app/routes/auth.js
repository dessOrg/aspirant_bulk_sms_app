var User = require('../models/user');
var Manifesto = require('../models/manifesto');
var Balance = require('../models/tokens');
var passport = require('passport');
var base64url = require('base64url');
var multer = require('multer');
var fs = require('fs');
var pictures = multer({});

var upload = multer({ dest: 'uploads/' });

// We need this to build our post string
var querystring = require('querystring');
var https       = require('https');


module.exports = function(app) {

  // africastalking user credentials
  var username = 'desshub';
  var apikey   = 'b8a87060086b16297c5ebe5190964f09fd258ec51a969ad88cd8c131243ef8fc';

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

                      var phone = user.phone;

                        function sendMessage() {

                        // Define the recipient numbers in a comma separated string
                        // Numbers should be in international format as shown
                        var to      = phone;

                        // And of course we want our recipients to know what we really do
                        var message = "You have succesfully created account with aspirant254. Tell your people why they should vote for you. Your phone number is private.";

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
                                if ( recipients.length > 0 ) {
                                    for (var i = 0; i < recipients.length; ++i ) {
                                        var logStr  = 'number=' + recipients[i].number;
                                        logStr     += ';cost='   + recipients[i].cost;
                                        logStr     += ';status=' + recipients[i].status; // status is either "Success" or "error message"
                                        console.log(logStr);
                                        }
                                    } else {
                                        console.log('Error while sending: ' + jsObject.SMSMessageData.Message);
                                }
                            });
                        });

                        // Add post parameters to the http request
                        post_req.write(post_data);

                        post_req.end();
                    }
                    //Call sendMessage method
                    sendMessage();
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

  app.post('/image/update', upload.single('image'), function(req, res){

    var user = req.user;
    var image = req.image;
    var tmp_path = req.file.path;

   /** The original name of the uploaded file
       stored in the variable "originalname". **/
   var target_path = 'uploads/' + req.file.originalname;
   /** A better way to copy the uploaded file. **/
   var src = fs.createReadStream(tmp_path);
   var dest = fs.createWriteStream(target_path);
   src.pipe(dest);
   fs.unlink(tmp_path); //deleting the tmp_path


     var id = user.id;
     console.log(id);
     User.findById(id, function(err, user){
       if(err) return err;

       user._id = user.id;
       user.picture = target_path;
       user.save(function(err, user){
         if(err) return err;

         console.log(user);

         req.flash('success_msg', "Profile image uploaded");
         res.redirect('/dashboard');
       })


     })

  })

  app.post('/party/logo/update', upload.single('image'), function(req, res){

    var user = req.user;
    var image = req.image;
    var tmp_path = req.file.path;

   /** The original name of the uploaded file
       stored in the variable "originalname". **/
   var target_path = 'uploads/' + req.file.originalname;
   /** A better way to copy the uploaded file. **/
   var src = fs.createReadStream(tmp_path);
   var dest = fs.createWriteStream(target_path);
   src.pipe(dest);
   fs.unlink(tmp_path); //deleting the tmp_path


     var id = user.id;
     console.log(id);
     User.findById(id, function(err, user){
       if(err) return err;

       user._id = user.id;
       user.party_image = target_path;
       user.save(function(err, user){
         if(err) return err;

         console.log(user);

         req.flash('success_msg', "Profile image uploaded");
         res.redirect('/admin/form');
       })


     })

  })


  app.post('/user/update/:id', function(req, res){
    var firstname=req.body.firstname;
    var lastname=req.body.lastname;
    var username=req.body.username;
    var gender=req.body.gender;
    var email=req.body.email;
    var phoneno=req.body.phoneno;
    var post=req.body.post;
    var county=req.body.county;
    var constituency=req.body.constituency;
    var ward=req.body.ward;
    var slogan=req.body.slogan;
    var party=req.body.party;
    var twitter=req.body.twitter;
    var facebook=req.body.facebook;
    var linkedin=req.body.linkedin;


      var user = new User();
      user._id = req.params.id,


      user.update({firstname:firstname,
      lastname: lastname,
      username: username,
      gender: gender,
      email : email,
      phoneno: phoneno,
      post : post,
      party : party,
      constituency: constituency,
      ward : ward,
      county : county,
      slogan: slogan,
      twitter : twitter,
      facebook : facebook,
      linkedin : linkedin},function(err, user){
        if(err) return err;

        console.log(user);
        res.redirect('/admin/form');
    })


  })

  app.post('/bio/update/:id', function(req, res){

      var bio=req.body.bio;

      var user = new User();
      user._id = req.params.id,

      user.update({bio : bio},function(err, user){
        if(err) return err;

        console.log(user);
        res.redirect('/admin/form');
    })


  })


  app.post('/manifesto/create/:id', function(req, res){
    var user = req.params.id;
    var title = req.body.manifesto;

    var manifesto = new Manifesto();
    manifesto.title = title,
    manifesto.user = user
    manifesto.save(function(err, manifesto){
      if(err) return err;

      res.redirect('/admin/form');
    })

  })

  app.get('/delete/manifesto/:id', function(req, res){

    Manifesto.find({id:req.params.id}, function(err, manifesto) {
   if (err) throw err;
   // delete sms
   var manifesto = new Manifesto();
   manifesto._id = req.params.id;
   manifesto.remove(function(err) {
  if (err) throw err;
   req.session.oldUrl = req.url;
   req.flash('success_msg', 'Campaign removed succesfully.' );
   res.redirect('/admin/form');
  });
  });

  })

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
