const express = require('express');
const { getProgrammes, getProgram, addProgram, updateProgram, deleteProgram } = require('../controllers/programmes');
const router = express.Router({ mergeParams: true });

// router.route('/radius/:zipcode/:distance').get(getTrainingcampInRadius);

router.route('/').get(getProgrammes).post(addProgram);
router.route('/:id').get(getProgram).put(updateProgram).delete(deleteProgram);
module.exports = router;
