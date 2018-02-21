
/*
  Express.js

*/

const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const authRoutes = require('./authRouter.js');
app.use(authRoutes.read);

const PORT = 8000;

/*
  Routes come here
*/


app.listen(PORT, () => {
  console.log('App running at localhost://%d', PORT);
});
