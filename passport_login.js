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

session.handleSession(app);

app.use(validate(app,validator_options));
app.use(bodyParser.urlencoded({extended: true}));

/*Pug is used for views in templates-folder*/
app.set('views', __dirname + '/templates/');
app.set('view engine', 'pug');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, {message:'Incorrect username.'});
      }
			//User was found, check password
			user.comparePassword( password, function(err, isMatch){
				if(isMatch){
					//Send user object password so that it does not show up in request
					passwordless_usr = {
						username: user.username,
						readAttribute: user.readAttribute,
            createAttribute: user.createAttribute,
            updateAttribute: user.updateAttribute,
            deleteAttribute: user.deleteAttribute,
					};
					return done(null,passwordless_usr);
				}
				else{
					return done(null, false,{message: 'Incorrect username or password'});
				}
			});
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
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
		return res.render({message: 'Already logged in'});
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
				res.json({message: 'Logged in successfully'});
			}
		});
	}) (req,res,next);
});

module.exports = ({
	logout,
	login_get,
	login_post
});