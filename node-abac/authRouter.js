
const express = require('express');
const app = express();
const router = express.Router();
var validate = require('form-validate');

const nodeAbac = require('node-abac');
const policies = require('./policies.js').policies;

const session = require('../express_session');

const appConfig = require('../app_config.js');

const db = require('../db.js');


/*
  TODO:
  more routes
*/

/*Pug is used for views in templates-folder*/
app.set('views', __dirname + '/../templates/');
app.set('view engine', 'pug');

app.use(validate());

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
const read = app.get('/read/', function(req,res){

  if(!req.user){
    res.json({
      "message": "log in"
    });
  }
  
  if( Abac.enforce('can-read', req.user) ){
    db.getAllData( function(err,data){
      if(data){
        res.render('read.pug',{'data':data});
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
  if(!req.user){
    res.json({
      "message": "log in"
    });
  }
  
  if( Abac.enforce('can-create', req.user) ){
    req.Validator.filter('data_text', {
      escapeHTML:true,
      stripTags:true
    })
    .validate('data_text',{
      length:{
        min:appConfig.data_attr.min_length
      }
    });

     req.Validator.getErrors( function(validator_errors){
      //If errors back to create screen
      if(validator_errors.length > 0){
        var error = '';
        for(err in validator_errors){
          error += err + ' ';
        }
        redirect('/create', 200, {message: error});
      }

      //Insert the data to database
      db.createData( req.Validator.getValue('data_text') );

      res.json('Data added');

     });

  }
  else{
    unauthorized(err,res);
  }
});
//                                   (\\d[a-z][A-Z]+)
const update_get = app.get('/edit/:id', function(req,res){
  if(!req.user){
    res.redirect('/login');
  }
  if( Abac.enforce('can-update', req.user) ){

    

    db.readData(req.params.id, function(err,data){
      if(err){
        res.status(500);
        res.json({error:'Error'});
      }
      res.render(
        'update.pug',
        {
          'id': data._id,
          'orginal_text': data.text
        }
      );
    });
  }

});

const update_post = app.post('/edit/:id', function(req,res){
  if(!req.user){
    res.redirect('/login');
  }
  if( Abac.enforce('can-update', req.user) ){
    req.Validator.filter('edited_text', {
      escapeHTML:true,
      stripTags:true
    })
    req.Validator.validate('edited_text',{
      length:{
        min:appConfig.data_attr.min_length
      }
    });

    req.Validator.validate('id', {
      length:{
        min:1
      },
      alphaNumeric:true
    });

    req.Validator.getErrors( function(validator_errors){
      //If errors back to create screen
      if(validator_errors.length > 0){
        var error = '';
        for(err in validator_errors){
          error += err + ' ';
        }
        res.redirect('/edit/:id', 200, {message: error});
      }

      //Insert the data to database
      db.updateData( req.Validator.getValue('id') ,req.Validator.getValue('edited_text') );

      res.redirect('/read/');
    });

  };

});


module.exports =  {
	read,
  create_get,
  create_post,
  update_get,
  update_post
};


