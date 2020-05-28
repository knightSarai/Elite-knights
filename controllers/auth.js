const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @desc  Create user
// @route GET /api/v1/auth/register
// @access public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	// Create User
	const user = await User.create({
		name,
		email,
		password,
		role
	});
	//create token
	const token = user.getSignedJwtToken();
	res.status(200).json({ success: true, token });
});
