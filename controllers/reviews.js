const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Review = require('../models/Review');
const Trainingcamp = require('../models/Trainingcamp');

// @desc   Get reviews
// @route  GET /api/v1/reviews
// @route  GET /api/v1/trainingcamps/:trainingcampId/reviews
// @access public
exports.getReviews = asyncHandler(async (req, res, next) => {
	if (req.params.trainingcampId) {
		const reviews = await Review.find({ trainingcamp: req.params.trainingcampId });

		return res.status(200).json({
			success: true,
			count: reviews.length,
			data: reviews
		});
	} else {
		return res.status(200).json(res.filteredResults);
	}
});

// @desc   Get single review
// @route  GET /api/v1/reviews/:id
// @access public
exports.getReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id).populate({
		path: 'trainingcamp',
		select: 'name description'
	});

	if (!review) {
		return next(new ErrorResponse(`No review with id of ${req.params.id}`, 404));
	}
	res.status(200).json({
		success: true,
		data: review
	});
});

// @desc   Add review
// @route  POST /api/v1/trainingcamp/:trainingcampd/reviews
// @access private
exports.addReview = asyncHandler(async (req, res, next) => {
	req.body.trainingcamp = req.params.trainingcampId;
	req.body.user = req.user.id;

	const trainingcamp = await Trainingcamp.findById(req.params.trainingcampId);

	if (!trainingcamp) {
		return next(new ErrorResponse(`No trainingcamp with id ${req.params.trainingcampId}`, 404));
	}

	const review = await Review.create(req.body);

	res.status(201).json({
		success: true,
		data: review
	});
});

// @desc   Update review
// @route  PUT /api/v1/reviews/:id
// @access private
exports.updateReview = asyncHandler(async (req, res, next) => {
	let review = await Review.findById(req.params.id);
	if (!review) {
		return next(new ErrorResponse(`No review with id of ${req.params.id}`, 404));
	}
	// user === review creator
	if (review.user.toString() !== req.user.id) {
		return next(new ErrorResponse(`User is not autherized to update this review`), 404);
	}
	// update the review
	review = await Review.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});
	res.status(200).json({
		success: true,
		data: review
	});
});

// @desc   Delete review
// @route  DELETE /api/v1/reviews/:id
// @access private
exports.deleteReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id);
	if (!review) {
		return next(new ErrorResponse(`No review with id of ${req.params.id}`, 404));
	}
	// user === review creator
	if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(new ErrorResponse(`User is not autherized to delete this review`), 404);
	}
	// delete the review
	review.remove();

	res.status(200).json({
		success: true,
		data: {}
	});
});
