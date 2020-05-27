const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Program = require('../models/Program');
const Trainingcamp = require('../models/Trainingcamp');
// @desc   Get all programmes
// @route  GET /api/v1/programmes
// @route  GET /api/v1/trainingcamps/:trainingcampId/programmes
// @access public
exports.getProgrammes = asyncHandler(async (req, res, next) => {
	if (req.params.trainingcampId) {
		const courses = await Program.find({ trainingcamp: req.params.trainingcampId });

		return res.status(200).json({
			success: true,
			count: courses.length,
			data: courses
		});
	} else {
		return res.status(200).json(res.filteredResults);
	}
});

// @desc   Get single program
// @route  GET /api/v1/programmes/:id
// @access public
exports.getProgram = asyncHandler(async (req, res, next) => {
	const program = await Program.findById(req.params.id).populate({
		path: 'trainingcamp',
		select: 'name description'
	});

	if (!program) {
		return next(new ErrorResponse(`No program with the id of ${req.params.id}`, 404));
	}
	res.status(200).json({
		success: true,
		data: program
	});
});

// @desc   Add single program
// @route  POST /api/v1/trainingcamps/:trainingcampId/programmes
// @access Private
exports.addProgram = asyncHandler(async (req, res, next) => {
	req.body.trainingcamp = req.params.trainingcampId;

	const trainingcamp = await Trainingcamp.findById(req.params.trainingcampId);

	if (!trainingcamp) {
		return next(new ErrorResponse(`No trainingcamp with the id of ${req.params.trainingcampId}`, 404));
	}

	// create new program
	const program = await Program.create(req.body);

	res.status(200).json({
		success: true,
		data: program
	});
});

// @desc   Update single program
// @route  PUT /api/v1/programmes/:id
// @access Private
exports.updateProgram = asyncHandler(async (req, res, next) => {
	let program = Program.findById(req.params.id);

	if (!program) {
		return next(new ErrorResponse(`No Program with the id of ${req.params.id}`), 404);
	}
	program = await Program.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});
	res.status(200).json({
		success: true,
		data: program
	});
});

// @desc   Delete single training camp
// @route  PUT /api/v1/programmes/:id
// @access Private
exports.deleteProgram = asyncHandler(async (req, res, next) => {
	const program = await Program.findById(req.params.id);
	console.log(program);

	if (!program) {
		return next(new ErrorResponse(`No Program with the id of ${req.params.id}`), 404);
	}

	await program.remove();

	res.status(200).json({
		success: true,
		data: `program removed `
	});
});
