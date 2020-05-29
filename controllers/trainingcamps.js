const path = require('path');
const geocoder = require('../utils/geocoder');
const Trainingcamp = require('../models/Trainingcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc  Get all training camp
// @route GET /api/v1/trainingcamps
// @access public
exports.getTrainingcamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.filteredResults);
});

// @desc  Get single training camp
// @route GET /api/v1/trainingcamps/:id
// @access public
exports.getTrainingcamp = asyncHandler(async (req, res, next) => {
	const trainingcamp = await Trainingcamp.findById(req.params.id);
	if (!trainingcamp) {
		return next(new ErrorResponse(`training camp not found with id of ${req.params.id}`, 404));
	}
	res.status(200).json({ success: true, data: trainingcamp });
});

// @desc  create new training camp
// @route POST /api/v1/trainingcamps/:id
// @access Private
exports.createTrainingcamp = asyncHandler(async (req, res, next) => {
	// add user to req.body
	req.body.user = req.user.id;

	//Check for trainingcamp by the owner user
	const userTrainingcamp = await Trainingcamp.findOne({ user: req.user.id });

	// if the user is not an admin, only one training camp can be added
	if (userTrainingcamp && req.user.role !== 'admin') {
		return next(new ErrorResponse(`The trainer has already trainingcamp`), 400);
	}

	const trainingcamp = await Trainingcamp.create(req.body);
	res.status(201).json({ success: true, data: trainingcamp });
});

// @desc  Update training camp
// @route PUT /api/v1/trainingcamps/:id
// @access Private
exports.updateTrainingcamp = asyncHandler(async (req, res, next) => {
	let trainingcamp = await Trainingcamp.findById(req.params.id);
	if (!trainingcamp) {
		return next(new ErrorResponse(`training camp not found with id of ${req.params.id}`));
	}
	// user === training camp owner
	if (trainingcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(new ErrorResponse(`User is not autherized to update this training camp`), 404);
	}
	trainingcamp = await Trainingcamp.findById(req.params.id, req.body, {
		new: true,
		runValidators: true
	});
	res.status(200).json({ success: true, data: trainingcamp });
});

// @desc  Delete training camp
// @route DELETE /api/v1/trainingcamps/:id
// @access Private
exports.deleteTrainingcamp = asyncHandler(async (req, res, next) => {
	const trainingcamp = await Trainingcamp.findById(req.params.id);
	if (!trainingcamp) {
		return next(new ErrorResponse(`training camp not found with id of ${req.params.id}`));
	}
	// user === training camp trainer
	if (trainingcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(new ErrorResponse(`User is not autherized to delete this training camp`), 404);
	}
	// to trigger on Cascade delete model middleware
	trainingcamp.remove();

	res.status(200).json({ success: true, data: trainingcamp.name });
});

// @desc  Upload te training camp
// @route DELETE /api/v1/trainingcamps/:id/photo
// @access Private
exports.trainingcampPhotoUpload = asyncHandler(async (req, res, next) => {
	const trainingcamp = await Trainingcamp.findById(req.params.id);
	if (!trainingcamp) {
		return next(new ErrorResponse(`training camp not found with id of ${req.params.id}`));
	}

	if (!req.files) {
		return next(new ErrorResponse(`please upload a file`), 400);
	}

	const file = req.files.file;

	// Make sure the image is a photo
	if (!file.mimetype.startsWith('image')) {
		return next(new ErrorResponse(`please upload an Image file`), 400);
	}

	//Check file size
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(new ErrorResponse(`please upload an Image less than ${process.env.MAX_FILE_UPLOAD}`), 400);
	}

	// create custom file name
	file.name = `photo_${trainingcamp._id}${path.parse(file.name).ext}`;
	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.error(err);
			return next(new ErrorResponse(`problem with file upload`), 500);
		}
		await Trainingcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
		res.status(200).json({
			success: true,
			data: file.name
		});
	});
});

// @desc  Get training camp within a radius
// @route GET /api/v1/trainingcamps/radius/:zipcod/:distance
// @access public
// exports.getTrainingcampInRadius = asyncHandler(async (req, res, next) => {
// 	const { zipcode, distance } = req.params;
// 	// Get lat/lng from geocoder
// 	const loc = await geocoder.geocode(zipcode);
// 	const lat = loc[0].latitude;
// 	const lng = loc[0].longitude;

// 	// Calc radius using radian
// 	// Divide distance by radius of Earth
// 	// Earth Radius = 3,963 mi / 6,378 km
// 	const radius = distance / 3963;

// 	const trainingcamps = await Trainingcamp.find({
// 		location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
// 	});
// 	res.status(200).json({
// 		success: true,
// 		count: trainingcamps.length,
// 		data: trainingcamps
// 	});
// });
