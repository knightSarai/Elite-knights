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
		ref: 'Trainingcamp',
		required: true
	}
});

// static method to fet average cost tuitions
ProgramSchema.statics.getAverageCost = async function(trainingcampId) {
	//aggergation to get an object with id of the training camp & the average cost
	const obj = await this.aggregate([
		{
			$match: { trainingcamp: trainingcampId }
		},
		{
			$group: {
				_id: '$trainingcamp',
				averageCost: { $avg: '$tuition' }
			}
		}
	]);
	try {
		await this.model('Trainingcamp').findByIdAndUpdate(trainingcampId, {
			averageCost: Math.ceil(obj[0].averageCost / 10) * 10
		});
	} catch (error) {
		console.log(error);
	}
};

// Call getAverageCost after save
ProgramSchema.post('save', function() {
	this.constructor.getAverageCost(this.trainingcamp);
});

// Call getAverageCost before remove save
ProgramSchema.pre('save', function() {
	this.constructor.getAverageCost(this.trainingcamp);
});

module.exports = mongoose.model('Program', ProgramSchema);
