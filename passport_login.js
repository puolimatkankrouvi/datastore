var app = require('express')();
var validate = require('form-validate');
var bodyParser = require('body-parser');
var config = require('./app_config.js');
var User = require('./user.js').User;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('./express_session.js');

var validator_options = {
	escapeHTML:true,
	stripTags:true
}

app.use(validate(app,validator_options));
app.use(bodyParser.urlencoded({extended: true}));

session.handleSession(app);

/*Pug is used for views in templates-folder*/
app.set('views', __dirname + '/templates/');
app.set('view engine', 'pug');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, {message:'Incorrect username or password'});
      }
			//User was found, check password
			user.comparePassword( password, function(err, isMatch){
				if(isMatch){
					return done(null,user);
				}
				else{
					return done(null, false,{message: 'Incorrect username or password'});
				}
			});
    });
  }
));

passport.serializeUser(function(user, done) {
	
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	User.findOne({'_id':id}, function(err,user){
		//Let's not expose password in user object
	  passwordless_usr = {
		  username: user.username,
		  readAttribute: user.readAttribute,
      createAttribute: user.createAttribute,
      updateAttribute: user.updateAttribute,
      deleteAttribute: user.deleteAttribute,
      role: user.role,
	  };
		//Has user field for node-abac
	  done(null, {'user': passwordless_usr});		
	});

});

app.use(passport.initialize());
app.use(passport.session());


var logout = app.get('/logout/', function(req,res){
  req.session.destroy( function(err){
  	return res.redirect('/login/');
  });
});

var login_get = app.get('/login/', function(req,res){
	if(!req.user){
		res.render('login.pug'); 
	}
	else{
		return res.json({message: 'Already logged in'});
	}
});

var login_post = app.post('/login/', function(req,res,next){
	passport.authenticate('local', function(err,user,info){
		if(err){
			return next(err);
		}
		if(!user){
			return res.redirect('/login/');
		}
		req.logIn( user, function(error){
			if(error){
				return next(error);
			}
			else{
				res.redirect('/login_success');
			}
		});
	}) (req,res,next);
});

var login_success = app.get('/login_success',function(req,res){
	res.json({message: 'Logged in successfully'});
});

module.exports = ({
	logout,
	login_get,
	login_post,
	login_success
});