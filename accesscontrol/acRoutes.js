const express = require('express');
const app = express();
const router = express.Router();
const app_config = require('../app_config.js');
const AccessControl = require('accesscontrol');
var {readData,updateData,updateGet,createData} = require('../operations.js');


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


const ac = new AccessControl();

// Käyttäjärooli
ac.grant('user')
  .readAny('data')
// Admin
.grant('admin')
  .readAny('data')
  .updateAny('data');


/* reititys lukemiseen */
const read = app.get('/', function(req, res, next){

	if(!req.user){
    return res.redirect('/login');
  }
  //
  console.log(req.user.user);
	const permission = ac.can(req.user.user.role).readAny('data');

	if(permission.granted){
		readData(req,res);
	}
	else{
		unauthorized(req,res);
	}
});

const update_get = app.get('/edit/:id', function(req,res,next){
  if(!req.user){
    return res.redirect('/login');
  }

  const permission = ac.can(req.user.user.role).updateAny('data');
  if(permission.granted){
    updateGet(req,res);  	
  }
  else{
    unauthorized(req,res);  	
  }
});


const update_post = app.post('/edit/:id', function(req,res,next){
  if(!req.user){
    return res.redirect('/login');
  }
  const permission = ac.can(req.user.user.role).editAny('data');
  if(permission.granted){
    updateGet(req,res);  	
  }
  else{
    unauthorized(req,res);  	
  }
});


module.exports = {
	read
}