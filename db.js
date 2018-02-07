const mongoose = require('mongoose')



database_name = 'tietokanta';

//Own computer url
//mongo_url = 'mongodb://localhost:27017/' + database_name;

//Heroku url
mongo_url = 'mongodb://pompeli:P0mpel1p0ll0@ds139585.mlab.com:39585/' + database_name
var connection = mongoose.connect(mongo_url);


var dataSchema = mongoose.Schema({
	text: String,

});

var Data = mongoose.model("DataModel", dataSchema);


function handleError(error){
	console.log(error);
}


var createData = function(text){
	let data = new Data({text: text});
	data.save( (error) =>{
		if(error){
			handleError(error);
		}
	}
	);
}

var updateData = function(id, text){

	Data.findById(id, (err, data) => {
		if(error){
			handleError(error);
		}

		data.text = text;
		data.save( (error) => {
			if(error){
				handleError(error);
			}
		});
	});

}

var deleteData = function(id){
	Data.remove({_id:id} , (error) => {
		if(error){
			handleError(error);
		}
	});
}

var readData = function(id){
	Data.findById(id, (err, data) => {
		if(error){
			handleError(error);
		}

		return data.text;
	});
}

module.exports = {
	createData,
	updateData,
	deleteData,
	readData
}