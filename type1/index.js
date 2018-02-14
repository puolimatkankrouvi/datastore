
/*
  Express.js

*/

const app = require('express')();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended: true}));
const PORT = 8000;

/*
  Middleware goes here
*/


app.listen(PORT, () => {
	console.log('App running at localhost://%d', PORT);
});
