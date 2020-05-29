const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [ true, 'Please add a title for a review' ]
	},
	text: {
		type: String,
		required: [ true, 'Please add a some text' ]
	},
	rating: {
		type: Number,
		min: 1,
		max: 5,
		required: [ true, 'Please add a rating between 1 and 5' ]
	},
	trainingcamp: {
		type: mongoose.Schema.ObjectId,
		ref: 'Trainingcamp',
		required: true
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

// Prevent user from submitting more than one review per trainingcamp
ReviewSchema.index({ trainingcamp: 1, user: 1 }, { unique: true });

// static method to fet average rating tuitions
ReviewSchema.statics.getAverageRating = async function(trainingcampId) {
	//aggergation to get an object with id of the review & the average reating
	const obj = await this.aggregate([
		{
			$match: { trainingcamp: trainingcampId }
		},
		{
			$group: {
				_id: '$trainingcamp',
				averageRating: { $avg: '$rating' }
			}
		}
	]);
	try {
		await this.model('Trainingcamp').findByIdAndUpdate(trainingcampId, {
			averageRating: obj[0].averageRating
		});
	} catch (error) {
		console.log(error);
	}
};

// Call getAverageRatimg after save
ReviewSchema.post('save', function() {
	this.constructor.getAverageRating(this.trainingcamp);
});

// Call getAverageRating before remove
ReviewSchema.pre('save', function() {
	this.constructor.getAverageRating(this.trainingcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
