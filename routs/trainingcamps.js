const express = require('express');
const {
	getTrainingcamps,
	getTrainingcamp,
	createTrainingcamp,
	updateTrainingcamp,
	deleteTrainingcamp,
	getTrainingcampInRadius
} = require('../controllers/trainingcamps');
const router = express.Router();

// router.route('/radius/:zipcode/:distance').get(getTrainingcampInRadius);

router.route('/').get(getTrainingcamps).post(createTrainingcamp);

router.route('/:id').get(getTrainingcamp).put(updateTrainingcamp).delete(deleteTrainingcamp);

module.exports = router;
