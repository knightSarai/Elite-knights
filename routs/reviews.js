const express = require('express');
const { getReviews, getReview, addReview, updateReview, deleteReview } = require('../controllers/reviews');

const Rivew = require('../models/Review');

const router = express.Router({ mergeParams: true });

const filteredResults = require('../middleware/filteredResults');
const { protect, authorize } = require('../middleware/auth');

router
	.route('/')
	.get(filteredResults(Rivew, { path: 'trainingcamp', select: 'name and decription' }), getReviews)
	.post(protect, authorize('user', 'admin'), addReview);

router
	.route('/:id')
	.get(getReview)
	.put(protect, authorize('user'), updateReview)
	.delete(protect, authorize('user', 'admin'), deleteReview);
module.exports = router;
