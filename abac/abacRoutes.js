const express = require('express');
const app = express();
const router = express.Router();
const app_config = require('../app_config.js');
const db = require('../db.js');
const MongoStore = require('connect-mongo');
const validator = require('form-validate');
const appConfig = require('../app_config.js');


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

function createData(req,res){
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

function updateGet(req,res){
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

function updateData(req,res){
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

