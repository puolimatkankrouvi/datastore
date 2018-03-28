const express = require('express');
const app = express();
const router = express.Router();
const app_config = require('../app_config.js');
const db = require('../db.js');
const MongoStore = require('connect-mongo');


/*Pug is used for views in templates-folder*/
app.set('views', __dirname + '/../templates/');
app.set('view engine', 'pug');

var unauthorized = function(req,res){
  res.status(401);
  return res.json(
    {
      'message': 'Unauthorized 401'
    });
};

var not_found = function(req, res){
  res.status(404);
  return res.json('Not found 404');
};



function readData(req,res){
	db.getAllData( function(err,data){
	  if(data){
      res.render('read.pug',{'data':data});
    }
    else{
      not_found(req,res);
    }
  });
};

//Serverin tunniste
const NAME = app_config.server_name;
//Abac käyttöön
const abac = require('abac');

//Politiikat
abac.set_policy(NAME, 'delete', function(req){
	return (req.user.user.deleteAttribute == true ? true : false);
});
abac.set_policy(NAME, 'update', function(req){
	return (req.user.user.updateAttribute == true ? true : false);
});
abac.set_policy(NAME, 'create', function(req){
	return (req.user.user.createAttribute == true ? true : false);
});
abac.set_policy(NAME, 'read', function(req){
	return (req.user.user.readAttribute == true ? true : false);
});

/* reititys lukemiseen */
const read = app.get('/', function(req, res, next){
	if(!req.user){
		return res.redirect('/login');
	}

  abac.can(NAME, 'read', {
    yes: function() {
      readData(req,res);
    },
    no: function(err, info) {
      unauthorized(req,res); 
    }
  })(req, res);
});






module.exports = ({read});

