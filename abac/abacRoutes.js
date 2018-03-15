const express = require('express');
const app = express();
const router = express.Router();
const app_config = require('../app_config.js');
var {readData,updateData,updateGet,createData} = require('../operations.js');


/*Pug is used for views in templates-folder*/
app.set('views', __dirname + '/../templates/');
app.set('view engine', 'pug');

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


const create_get = app.get('/create', function(req,res,next){
  if(!req.user){
    return res.redirect('/login');
  }
  abac.can(NAME, 'create', {
    yes: function() {
      res.render('create.pug');
    },
    no: function(err, info) {
      unauthorized(req,res); 
    }
  })(req, res);
});

const create_post = app.post('/create', function(req,res,next){
  if(!req.user){
    return res.redirect('/login');
  }
  abac.can(NAME, 'create', {
    yes: function() {
      createData(req,res);
    },
    no: function(err, info) {
      unauthorized(req,res); 
    }
  })(req, res);
});

const update_get = app.get('/edit/:id', function(req,res,next){
  if(!req.user){
    return res.redirect('/login');
  }
  abac.can(NAME, 'update', {
    yes: function() {
      updateGet(req,res);
    },
    no: function(err, info) {
      unauthorized(req,res); 
    }
  })(req, res);
});

const update_post = app.post('/edit/:id', function(req,res,next){
  if(!req.user){
    return res.redirect('/login');
  }
  abac.can(NAME, 'update', {
    yes: function() {
      updateData(req,res);
    },
    no: function(err, info) {
      unauthorized(req,res); 
    }
  })(req, res);
});

module.exports = (
  {
    read,
    create_post,
    create_get
  }
);

