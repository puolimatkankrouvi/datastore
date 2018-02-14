const mongoose = require('mongoose')
const crypt = require('bcrypt')


database_name = 'userkanta';

// How many iterations is used to salt the password 
HASH_SALT_ITERATIONS = 12;

//Own computer url
//mongo_url = 'mongodb://localhost:27017/' + database_name;

//Heroku url
mongo_url = 'mongodb://pompeli:P0mpel1p0ll0@ds139585.mlab.com:39585/' + database_name
var connection = mongoose.connect(mongo_url);


var userSchema = mongoose.Schema({
	username: {type: String, required: true, index: {unique: true} },
	password: {type: String, required: true },
});

/* This middleware hashes password before saving */
userSchema.pre( 'save' , (next) => {
	var user = this;

    /* Hash the password only if it is new */
    if( user.isModified('password') ){
      brcypt.genSalt(HASH_SALT_ITERATIONS, (err, salt) => {
        if(err){
          return next(err);
        }
        bcrypt.hash( user.password, salt, (err, hashed) => {
          user.password = hashed;
        });
      });
    }

    next();

});

/* Comparator for password */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err){
          return cb(err)
        }
        cb(null, isMatch);
    });
};

var User = mongoose.model("UserModel", userSchema);