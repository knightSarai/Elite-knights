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
const Trainingcamp = require('../models/Trainingcamp');
const filteredResults = require('../middleware/filteredResults');

// include other resourse router
const programRouter = require('./programmes');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-rout into other resourse routers
router.use('/:trainingcampId/programmes', programRouter);
// router.route('/radius/:zipcode/:distance').get(getTrainingcampInRadius);

router.route('/:id/photo').put(protect, authorize('trainer', 'admin'), trainingcampPhotoUpload);

router
	.route('/')
	.get(filteredResults(Trainingcamp, 'programmes'), getTrainingcamps)
	.post(protect, authorize('trainer', 'admin'), createTrainingcamp);

router
	.route('/:id')
	.get(getTrainingcamp)
	.put(protect, updateTrainingcamp)
	.delete(protect, authorize('trainer', 'admin'), deleteTrainingcamp);

module.exports = router;
