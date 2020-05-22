const Trainingcamp = require('../models/Trainingcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
// @desc  Get all training camp
// @route GET /api/v1/trainingcamps
// @access public
exports.getTrainingcamps = asyncHandler(async (req, res, next) => {
	const trainingcamps = await Trainingcamp.find();
	res.status(200).json({ success: true, count: trainingcamps.length, data: trainingcamps });
});

// @desc  Get single training camp
// @route GET /api/v1/trainingcamps/:id
// @access public
exports.getTrainingcamp = asyncHandler(async (req, res, next) => {
	const trainingcamp = await Trainingcamp.findById(req.params.id);
	if (!trainingcamp) {
		return next(new ErrorResponse(`training camp not found with id of ${req.params.id}`));
	}
	res.status(200).json({ success: true, data: trainingcamp });
});

// @desc  create new training camp
// @route POST /api/v1/trainingcamps/:id
// @access Private
exports.createTrainingcamp = asyncHandler(async (req, res, next) => {
	const trainingcamp = await Trainingcamp.create(req.body);
	res.status(201).json({ success: true, data: trainingcamp });
});

// @desc  Update training camp
// @route PUT /api/v1/trainingcamps/:id
// @access Private
exports.updateTrainingcamp = asyncHandler(async (req, res, next) => {
	const trainingcamp = await Trainingcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});
	if (!trainingcamp) {
		return next(new ErrorResponse(`training camp not found with id of ${req.params.id}`));
	}
	res.status(200).json({ success: true, data: trainingcamp });
});

// @desc  Delete training camp
// @route DELETE /api/v1/trainingcamps/:id
// @access Private
exports.deleteTrainingcamp = asyncHandler(async (req, res, next) => {
	const trainingcamp = await Trainingcamp.findByIdAndDelete(req.params.id);
	if (!trainingcamp) {
		return next(new ErrorResponse(`training camp not found with id of ${req.params.id}`));
	}
	res.status(200).json({ success: true, data: trainingcamp.name });
});
