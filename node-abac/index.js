
/*
  Express.js

*/

const app = require('express')();
const bodyParser = require('body-parser');
const session = require('../express_session.js');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session.userMiddleware);

const PORT = 8000;

/*
  Routes come here
*/

const authRoutes = require('./authRouter.js');
app.use(authRoutes.read);

const registerRoutes = require('../express_register.js');
app.use(
  registerRoutes.register_get,
  registerRoutes.register_post
);

const loginRoutes = require('../passport_login.js');
app.use(
  loginRoutes.logout,
  loginRoutes.login_get,
  loginRoutes.login_post
);


app.listen(PORT, () => {
  console.log('App running at localhost://%d', PORT);
});
