const express = require('express');
const {
	getTrainingcamps,
	getTrainingcamp,
	createTrainingcamp,
	updateTrainingcamp,
	deleteTrainingcamp,
	getTrainingcampInRadius,
	trainingcampPhotoUpload
} = require('../controllers/trainingcamps');

// include other resourse router
const programRouter = require('./programmes');

const router = express.Router();

// Re-rout into other resourse routers
router.use('/:trainingcampId/programmes', programRouter);
// router.route('/radius/:zipcode/:distance').get(getTrainingcampInRadius);

router.route('/:id/photo').put(trainingcampPhotoUpload);

router.route('/').get(getTrainingcamps).post(createTrainingcamp);

router.route('/:id').get(getTrainingcamp).put(updateTrainingcamp).delete(deleteTrainingcamp);

module.exports = router;
