
/*
  Express.js

*/

const app = require('express')();
const bodyParser = require('body-parser');
const session = require('../express_session.js').handleSession(app);
app.use(bodyParser.urlencoded({extended: true}));

const PORT = 8000;

/*
  Routes come here
*/

const authRoutes = require('./authRouter.js');
app.use(authRoutes.read);

const loginRoutes = require('../express_login.js');
app.use(
  loginRoutes.logout,
  loginRoutes.login_get,
  loginRoutes.login_post
);


app.listen(PORT, () => {
  console.log('App running at localhost://%d', PORT);
});
