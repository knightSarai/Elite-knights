const mongoose = require('mongoose');
const slugify = require('slugify');

const TrainingcampSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [ true, 'Please add a name' ],
		unique: true,
		trim: true,
		maxlength: [ 50, "name can't be more than 50 charachters" ]
	},
	slug: String /* it's kind of url for UI  */,
	description: {
		type: String,
		required: [ true, 'Please add a description' ],
		trim: true,
		maxlength: [ 500, "description can't be more than 500 charachters" ]
	},
	website: {
		type: String,
		match: [
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
			'Please use a valid URL with HTTP or HTTPs'
		]
	},
	phone: {
		type: String,
		required: [ true, 'Please add a phone number' ],
		maxlength: [ 20, "phone number can't be longer than 20 charachters" ]
	},
	email: {
		type: String,
		match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please use a valid email' ]
	},
	address: {
		type: String,
		required: [ true, 'please add an address' ]
	},
	location: {
		//geoJSON Point
		type: {
			type: String,
			enum: [ 'point' ]
		},
		coordinate: {
			type: [ Number ],
			index: '2dsphere'
		},
		formattedAddress: String,
		street: String,
		city: String,
		state: String,
		zipcode: String,
		country: String
	},
	careers: {
		//Array of string
		type: [ String ],
		required: true,
		enum: [
			'none preperation to career training camp',
			'personal trainer',
			'strenght & condition couch',
			'sport team leader & coach',
			'Pediatric Physical Therapy',
			'Geriatric Physical Therapy',
			'Orthopedic Physical Therapy',
			'Vestibular Rehabilitation'
		]
	},
	averageRating: {
		type: Number,
		min: [ 1, 'Rating must be at least 1' ],
		max: [ 10, "Rating can't be more than 10" ]
	},
	averageCost: Number,
	photo: {
		type: String,
		default: 'no-photo.jpg'
	},
	housing: {
		type: Boolean,
		default: false
	},
	jobAssistance: {
		type: Boolean,
		default: false
	},
	jobGuarantee: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

//- Create Training camp slug from the name
TrainingcampSchema.pre('save', function(next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});
module.exports = mongoose.model('Trainingcamp', TrainingcampSchema);
