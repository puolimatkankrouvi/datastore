
const express = require('express');
const app = express();
const router = express.Router();

const nodeAbac = require('node-abac');
const policies = require('./policies.js');

const db = require('../db.js');


/*
  TODO:
  get current user,
  more routes
*/
var current_user = null;

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


module.exports =  {
	read
};


