const express = require("express");
const {
  getTrainingcamps,
  getTrainingcamp,
  createTrainingcamp,
  updateTrainingcamp,
  deleteTrainingcamp,
} = require("../controllers/trainingcamps");
const router = express.Router();

router.route("/").get(getTrainingcamps).post(createTrainingcamp);

router
  .route("/:id")
  .get(getTrainingcamp)
  .put(updateTrainingcamp)
  .delete(deleteTrainingcamp);

module.exports = router;
