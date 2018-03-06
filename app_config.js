

var app_config = {


	db_fields:{
		username: {
			min: 3,
			max: 256
		},
		password:{
			min: 4
		}
	},

	data_attr:{
		min_length:1
	}

}

module.exports = (app_config);