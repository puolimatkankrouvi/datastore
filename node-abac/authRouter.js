
const express = require('express');
const app = express();
const router = express.Router();
var validate = require('form-validate');

const nodeAbac = require('node-abac');
const policies = require('./policies.js');

const appConfig = require('../app_config.js');

const db = require('../db.js');


/*
  TODO:
  more routes
*/

/*Pug is used for views in templates-folder*/
app.set('views', __dirname + '/templates/');
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


/*Abac otetaan käyttöön */
const Abac = new nodeAbac(policies);

/* reititys lukemiseen */
const read = app.get('/read/:id', function(req,res){

  if(!req.user){
    res.json({
      "message": "log in"
    });
    return;
  }
  
  if( Abac.enforce('can-read', req.user) ){
    db.readData(req.params.id, function(data){
      if(data){
      	res.json(
      	  {
      	    "data": data
      	  }
      	);
      }
      else{
      	not_found(req,res);
      }
    });
  }
  else{
  	unauthorized(err,res);
  }
});

const create_get = app.get('/create',function(req,res){
  console.log(req);
  if(!req.user){
    res.json({
      "message": "log in"
    });
    return;
  }
  
  if( Abac.enforce('can-create', req.user) ){
    res.render('create.pug');
  }
  else{
    unauthorized(err,res);
  }
});

const create_post = app.post('/create',function(req,res){

  if(!res.locals.user){
    res.json({
      "message": "log in"
    });
    return;
  }
  
  if( Abac.enforce('can-create', req.user) ){
    req.validator.filter('data_text', {
      escapeHTML:true,
      stripTags:true
    })
    .validate('data_text',{
      length:{
        min:appConfig.data_attr.min_length
      }
    });

     req.validator.getErrors( function(validator_errors){
      //If errors back to create screen
      if(validator_errors.length > 0){
        var error = '';
        for(err in validator_errors){
          error += err + ' ';
        }
        redirect('/create', 200, {message: err});
      }

      //Insert the data to database
      db.createData( validator.getValue('data_text') );

     });

  }
  else{
    unauthorized(err,res);
  }
});


module.exports =  {
	read,
  create_get,
  create_post
};


