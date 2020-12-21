const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const tokenProtected = require("../middleware/tokenProtected");
const User = require("../schema/User");
const router = express.Router();

router.get("/", tokenProtected, (req, res) => {
  try {
    res.status(200).json({ ok: true, data: req.user });
  } catch (error) {
    return res
      .status(400)
      .json({ ok: true, err: String(error) })
      .end();
  }
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (findUser) {
      return res
        .status(200)
        .json({ ok: false, msg: "User already exists" })
        .end();
    }
    const salt = await bcrypt.genSalt(10);
    const hashword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashword,
      createdAt: new Date(),
    });
    const createdUser = await newUser.save();
    const token = jsonwebtoken.sign(
      { id: createdUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res
      .status(200)
      .cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
      .json({ ok: true, user: createdUser })
      .end();
  } catch (error) {
    return res
      .status(400)
      .json({ ok: false, err: String(error) })
      .end();
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (findUser) {
      console.log(findUser);
      const isPasswordCorrect = await bcrypt.compare(
        password,
        findUser.password
      );
      if (!isPasswordCorrect) {
        return res.status(200).json({ ok: false, msg: "Incorrect password" });
      }

      const token = jsonwebtoken.sign(
        { id: findUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res
        .status(200)
        .cookie("token", token, { httpOnly: true, maxAge: 60000 })
        .json({ ok: true, user: findUser });
    }
    return res.status(200).json({ ok: false, msg: "Not found" });
  } catch (error) {
    return res.status(400).json({ ok: true, err: String(error) });
  }
});

router.post("/logout", tokenProtected, async (req, res) => {
  if (req.user) {
    return res
      .status(200)
      .cookie("token", "", { httpOnly: true })
      .json({ ok: true });
  }
});

module.exports = router;
