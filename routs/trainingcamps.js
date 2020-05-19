const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ success: true, msg: "show all training camp" });
});

router.get("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `show training camp ${req.params.id}` });
});

router.post("/", (req, res) => {
  res.status(200).json({ success: true, msg: `create a new training camp` });
});

router.put("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `updat training camp ${req.params.id}` });
});

router.delete("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `delete training camp ${req.params.id}` });
});

module.exports = router;
