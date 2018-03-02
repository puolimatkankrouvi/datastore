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


var logout = app.get('/logout/', function(req,res,next){
  if(req.session){
    req.session.destroy( function(err,res){
      if(!err){
        return next;
      }
      else{
        return res.json({message: "Logout successful"});
      }
    });
	}
	else{
    return res.redirect('/login/');
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


	req.Validator.getErrors( function(err){
		User.findOne({
			username: req.Validator.getValue('username'),
			password: req.Validator.getValue('password')
		},
		function(user, err) {
			console.log(user);
		  if(user){
			  //Req login not a function
			  req.login(user, sendLoginSuccesful(req,res));
		  }
		  if(!user || err){
			  res.redirect('/login', 200, {
				  message: "Invalid username or password",
				  username: req.query.username
			  });
		  }
		});
		
	});
});

var sendLoginSuccesful = function(req,res){
	res.json({message:"Logged in successfully"});
}


module.exports = ({
	logout,
	login_get,
	login_post
});

