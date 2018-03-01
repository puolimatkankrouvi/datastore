
/*
  Express.js

*/

const app = require('express')();
const bodyParser = require('body-parser');
const session = require('../express_session.js').handleSession(app);
app.use(bodyParser.urlencoded({extended: true}));

const authRoutes = require('./authRouter.js');
app.use(authRoutes.read);

app.set('views', __dirname + '/../templates/');
app.set('view engine', 'pug');

const PORT = 8000;

/*
  Routes come here
*/

app.get('/logout/', function(req,res,next){
  if(req.session){
    req.session.destroy( function(err,res){
      if(!err){
        return next;
      }
      else{
        return res.json({message: "Logout successful"});
      }
    });
	}
	else{

	}
});

app.get('/login/', function(req,res){
	if(!res.session){
		res.render('login.pug'); 
	}
});

app.post('/login/', function(req,res){
	
})

app.listen(PORT, () => {
  console.log('App running at localhost://%d', PORT);
});
