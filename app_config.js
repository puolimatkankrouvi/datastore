

var app_config = {


	db_fields:{
		username: {
			min: 3,
			max: 256
		},
		password:{
			min: 4
		}
	}

}

module.exports = (app_config);