const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
	let error = { ...err };

	error.message = err.message;

	console.log(err);

	// Mongoose bad ObjectId
	if (err.name === 'CastError') {
		const message = `Resourse Not Found`;
		error = new ErrorResponse(message, 404);
	}

	//Mongoose duplicate Error
	if (err.code === 11000) {
		const message = `Duplicate field value error`;
		error = new ErrorResponse(message, 400);
	}

	//Mongoose validation error
	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map((value) => value.message);
		error = new ErrorResponse(message, 400);
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'server error'
	});
};

module.exports = errorHandler;
