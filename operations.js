const express = require('express');
const app = express();
const router = express.Router();
const db = require('./db.js');
const validator = require('form-validate');
const appConfig = require('./app_config.js');


var readData = function(req,res){
	db.getAllData( function(err,data){
	  if(data){
      res.render('read.pug',{'data':data});
    }
    else{
      not_found(req,res);
    }
  });
};

var createData = function(req,res){
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
      redirect('/read', 200);
    });
}

var updateGet = function(req,res){
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
};

var updateData = function(req,res){
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
      res.redirect('/create', {message: error});
    }
      //Insert the data to database
      db.updateData( req.Validator.getValue('id') ,req.Validator.getValue('edited_text') );
      res.redirect('/');
    });
}


module.exports = {
	readData,
	createData,
	updateGet,
	updateData
}