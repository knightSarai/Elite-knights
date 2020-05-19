// @desc  Get all training camp
// @route GET /api/v1/trainingcamps
// @access public
exports.getTrainingcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "show all training camp" });
};

// @desc  Get single training camp
// @route GET /api/v1/trainingcamps/:id
// @access public
exports.getTrainingcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `show training camp ${req.params.id}` });
};

// @desc  create new training camp
// @route POST /api/v1/trainingcamps/:id
// @access Private
exports.createTrainingcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `create a new training camp` });
};

// @desc  Update training camp
// @route PUT /api/v1/trainingcamps/:id
// @access Private
exports.updateTrainingcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `updat training camp ${req.params.id}` });
};

// @desc  Delete training camp
// @route DELETE /api/v1/trainingcamps/:id
// @access Private
exports.deleteTrainingcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `delete training camp ${req.params.id}` });
};
