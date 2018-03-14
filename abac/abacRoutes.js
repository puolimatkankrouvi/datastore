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
  res.json(
    {
      'message': 'Unauthorized 401'
    });
};

var not_found = function(req, res){
    res.status(404);
    res.json(
      {
        'message':'Not found 404'
      }
    );
};

//Serverin tunniste
const NAME = app_config.server_name;
//Abac käyttöön
const abac = require('abac');

//Added policies
abac.set_policy(NAME, 'delete', function(req){
	return (req.user.deleteAttribute == true ? true : false);
});
abac.set_policy(NAME, 'update', function(req){
	return (req.user.updateAttribute == true ? true : false);
});
abac.set_policy(NAME, 'create', function(req){
	return (req.user.createAttribute == true ? true : false);
});
abac.set_policy(NAME, 'read', function(req){
	if(req.user.readAttribute == true){
		return true;
	}
	else{
		return false;
	}
});

/* reititys lukemiseen */
const read = app.get('/read/', function(req,res){

	if(!req.user){
		return res.json('Log in');
	}

  db.getAllData( function(err,data){
  	console.log(data);
  	abac.can(NAME,'read', req.user, {
      yes: function() {
      
        if(data){
          res.render('read.pug',{'data':data});
        }
        else{
      	  not_found(req,res);
        }
      },
      no: function(err, info) {
        unauthorized(err,res);
      }
    }) (req,res);
  });
});


module.exports = ({read});

