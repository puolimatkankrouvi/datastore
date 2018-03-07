const crypto = require('crypto');
const session = require('express-session');



function handleSession(app){

  app.use(session({

    saveUninitialized: false,
    resave: false,
    name:"id",
    secret: crypto.randomBytes(64).toString('hex'),
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



function userMiddleware(req,res,next){
  res.locals.user = res.locals.user;
  console.log('user: ' + res.locals.user);
  next();
}


module.exports = ({
  handleSession,
  userMiddleware
});