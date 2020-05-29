const express = require('express');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/users');
const User = require('../models/User');

const router = express.Router({ mergeParams: true });

const filteredResults = require('../middleware/filteredResults');
const { protect, authorize } = require('../middleware/auth');

//any thing below these middlewares will use protect and authorize
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(filteredResults(User), getUsers).post(createUser);
router.route('/:id').get(getUser).post(createUser).put(updateUser).delete(deleteUser);

module.exports = router;
