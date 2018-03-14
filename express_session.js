const crypto = require('crypto');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connection = require('./db.js').client.connection;


function handleSession(app){

  app.use(session({

    saveUninitialized: false,
    resave: false,
    secret: crypto.randomBytes(64).toString('hex'),
    store: new MongoStore({
    	mongooseConnection: connection,
    	url: 'mongodb://pompeli:P0mpel1p0ll0@ds139585.mlab.com:39585/tietokanta'
    }),
    cookie:{
      path:'/',
      maxAge: 1000*60*20, //20 mins
      httpOnly: true,
    },
    //Using id instead of default connect.sid makes harder to determine the session mechanism
    name: 'id'
  }));

  session.Session.prototype.login = function(user, next){
	  this.user = user;
    next();
  }

}


module.exports = ({
  handleSession
});