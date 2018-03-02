var app = require('express')();
var validate = require('form-validate');
var bodyParser = require('body-parser');
var config = require('./app_config.js');
var User = require('./user.js').User;


var validator_options = {
	escapeHTML:true,
	stripTags:true
}

/*
  TODO:
  login after register
*/

app.use(validate(app,validator_options));

/*Pug is used for views in templates-folder*/
app.set('views', __dirname + '/templates/');
app.set('view engine', 'pug');


var register_get = app.get('/register/', function(req,res){
	res.render('register.pug');
});

var register_post = app.post('/register/', function(req,res){
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
		if(err){
			res.redirect('/register', 200, {message:"Invalid username or password"});
		}
		else{
			var newUser = new User({
				username: req.Validator.getValue('username'),
			  password: req.Validator.getValue('password'),
			  readAttribute: reqValidator.getValue('read_attr'),
			  createAttribute: reqValidator.getValue('create_attr'),
			  deleteAttribute: reqValidator.getValue('delete_attr'),
			  updateAttribute: reqValidator.getValue('update_attr')
			});
			newUser.save( function(err){
				if(!err){
					//Should log new user in
					register_succesful();
				}
				else{
					res.redirect('register.pug',{
				    message: err,
				    username: req.query.username
			    });
				}
			});
		}
	});
});

function register_succesful(){
	res.json({message:"Registered succesfully"});
}

module.exports = ({
	register_get,
	register_post
});