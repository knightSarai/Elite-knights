const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [ true, 'Please add a course title' ]
	},
	description: {
		type: String,
		required: [ true, 'Please add a description' ]
	},
	weeks: {
		type: String,
		required: [ true, 'Please add number of weeks' ]
	},
	tuition: {
		type: Number,
		required: [ true, 'Please add a tuition cost' ]
	},
	minimumSkill: {
		type: String,
		required: [ true, 'Pleas add a minimum skill' ],
		enumm: [ 'beginner', 'intermediate', 'advanced' ]
	},
	scholarshipAvailable: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	trainingcamp: {
		type: mongoose.Schema.ObjectId,
		ref: 'TrainingCamp',
		required: true
	}
});

module.exports = mongoose.model('Program', ProgramSchema);
