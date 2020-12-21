const express = require("express");
const tokenProtected = require("../middleware/tokenProtected");

const router = express.Router();

router.get("/user", tokenProtected, (req, res) => {
  if (req.user) {
    return res.status(200).json({ user: req.user });
  }
  return res.status(200).json({ ok: false });
});

module.exports = router;
