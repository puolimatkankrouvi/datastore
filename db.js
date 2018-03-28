const mongoose = require('mongoose')



database_name = 'tietokanta';

//Own computer url
//mongo_url = 'mongodb://localhost:27017/' + database_name;

//Heroku url
mongo_url = 'mongodb://pompeli:P0mpel1p0ll0@ds139585.mlab.com:39585/' + database_name
var client = mongoose.connect(mongo_url);


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
      console.log(error);
      handleError(error);
    }
  }
  );
}

var updateData = function(id, text){

  Data.findById(id, (err, data) => {
    if(err){
      handleError(err);
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

var readData = function(id,next){
  Data.findById(id, (err, data) => {
    if(err){
      next(err,null);
    }

    next(null,data);
  });
}

var getAllData = function(next){
  Data.find({}, function(err,data){
    if(err){
      handleError(err);
    }
    next(err,data);
  });
}

module.exports = {
  createData,
  updateData,
  deleteData,
  readData,
  getAllData,
  client
}