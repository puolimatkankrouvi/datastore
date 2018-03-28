var express = require('express');


/*
  Express.js

*/

const app = require('express')();
const bodyParser = require('body-parser');
const session = require('../express_session.js');
app.use(bodyParser.urlencoded({extended: true}));

const PORT = 8000;

/*
  Routes come here
*/


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

const loginRoutes = require('../passport_login.js');
app.use(
  loginRoutes.logout,
  loginRoutes.login_get,
  loginRoutes.login_post
);

const authRoutes = require('./abacRoutes.js');
app.use(
	authRoutes.read,
);

const registerRoutes = require('../express_register.js');
app.use(
  registerRoutes.register_get,
  registerRoutes.register_post
);

app.disable('trust proxy');

app.listen(PORT, () => {
  console.log('App running at localhost://%d', PORT);
});