const express = require('express');
const { getProgrammes, getProgram, addProgram, updateProgram, deleteProgram } = require('../controllers/programmes');
const Program = require('../models/Program');
const filteredResults = require('../middleware/filteredResults');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

router
	.route('/')
	.get(
		filteredResults(Program, {
			path: 'trainingcamp',
			select: 'name description'
		}),
		getProgrammes
	)
	.post(protect, authorize('trainer', 'admin'), addProgram);

router
	.route('/:id')
	.get(getProgram)
	.put(protect, authorize('trainer', 'admin'), updateProgram)
	.delete(protect, authorize('trainer', 'admin'), deleteProgram);

module.exports = router;
