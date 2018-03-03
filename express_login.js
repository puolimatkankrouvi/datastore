var app = require('express')();
var validate = require('form-validate');
var bodyParser = require('body-parser');
var config = require('./app_config.js');
var User = require('./user.js').User;


var validator_options = {
	escapeHTML:true,
	stripTags:true
}

app.use(validate(app,validator_options));

/*Pug is used for views in templates-folder*/
app.set('views', __dirname + '/templates/');
app.set('view engine', 'pug');


var logout = app.get('/logout/', function(req,res){
  if(req.session){
    req.session.destroy( function(err,res){
      if(!err){
        return res.json({message: "Error in logging out"});
      }
      else{
        return res.json({message: "Logout successful"});
      }
    });
	}
	else{
    return res.redirect('/login/',200);
	}
});

var login_get = app.get('/login/', function(req,res){
	if(!res.session){
		res.render('login.pug'); 
	}
});

var login_post = app.post('/login/', function(req,res){
	req.Validator.validate('username', 'Käyttäjänimen tulee olla tarpeeksi pitkä', {
		length:{
			min: config.db_fields.username.min,
			max: config.db_fields.username.max
		}
	})
	.filter('username', {
		trim: true
	})
	.validate('password', 'Salasanan tulee olla tarpeeksi pitkä', {
		length:{
			min: config.db_fields.password.min
		}
	})


	req.Validator.getErrors( function(validator_errors){
			if(validator_errors.length > 0){
				var error = '';
				for(err in validator_errors){
					error += err + ' ';
				}
				redirect('/login', 200, {message: err});
			}
			authenticate(req.Validator.getValue('username'),req.Validator.getValue('pw'),
				function(err,user){
				if(err){
					res.redirect('/login', 200, {message: err});
				}
				else
					if(user){
						session
						res.json({message:"Logged in successfully"});
					}
			});
		});
});


function authenticate(username, password, next){
		/*
		  Two part auth,
		  getting username first
		*/
		User.findOne({
			username: username
		})
		.exec( function(error, user){
			if(error){
				return next(error);
			}
			else if(!user){
				return next(new Error('User not found'));
			}
			//User was found, check password
			user.comparePassword( password, function(err, isMatch){
				if(isMatch){
					return next(null,user);
				}
				else{
					return next(new Error('Invalid username or password') ,null)
				}
			});

		});
};


module.exports = ({
	logout,
	login_get,
	login_post
});

