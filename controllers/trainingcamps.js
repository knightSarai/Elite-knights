const path = require('path');
const geocoder = require('../utils/geocoder');
const Trainingcamp = require('../models/Trainingcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc  Get all training camp
// @route GET /api/v1/trainingcamps
// @access public
exports.getTrainingcamps = asyncHandler(async (req, res, next) => {
	let query;

	const reqQuery = { ...req.query };

	// Fields to execlude, to use them not to treat them as search fields
	const removeFields = [ 'select', 'sort', 'page', 'limit' ];

	// loop over remove Fields an delete them from reqQuery
	removeFields.forEach((param) => delete reqQuery[param]);

	// create query string
	let queryStr = JSON.stringify(reqQuery);
	// create operator like ($gt, $gte, etc)
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
	// Finding resource
	query = Trainingcamp.find(JSON.parse(queryStr)).populate('programmes');

	//select Fields
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}

	// sort
	if (req.query.sort) {
		const sortby = req.query.sort.split(',').join(' ');
		query = query.sort(sortby);
	} else {
		query = query.sort('-createdAt');
	}
	//Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Trainingcamp.countDocuments();

	query = query.skip(startIndex).limit(limit);

	// Executing the query
	const trainingcamps = await query;

	// Pagination result
	const Pagination = {};

	if (endIndex < total) {
		Pagination.next = {
			page: page + 1,
			limit
		};
	}
	if (startIndex > 0) {
		Pagination.prev = {
			page: page - 1,
			limit
		};
	}
	res.status(200).json({ success: true, count: trainingcamps.length, Pagination, data: trainingcamps });
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
	const trainingcamp = await Trainingcamp.findById(req.params.id);
	if (!trainingcamp) {
		return next(new ErrorResponse(`training camp not found with id of ${req.params.id}`));
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
