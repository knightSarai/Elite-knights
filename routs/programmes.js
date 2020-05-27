const express = require('express');
const { getProgrammes, getProgram, addProgram, updateProgram, deleteProgram } = require('../controllers/programmes');
const Program = require('../models/Program');
const filteredResults = require('../middleware/filteredResults');
const router = express.Router({ mergeParams: true });

// router.route('/radius/:zipcode/:distance').get(getTrainingcampInRadius);

router
	.route('/')
	.get(
		filteredResults(Program, {
			path: 'trainingcamp',
			select: 'name description'
		}),
		getProgrammes
	)
	.post(addProgram);
router.route('/:id').get(getProgram).put(updateProgram).delete(deleteProgram);
module.exports = router;
