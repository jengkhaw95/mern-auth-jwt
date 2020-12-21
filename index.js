const express = require("express");
const app = express();
const path = require("path");
//const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const auth = require("./routes/auth");
const api = require("./routes/api");

app.use(express.static(__dirname + "./client/public"));
app.use(express.json());
app.use(cookieParser());
//app.use(cors());
app.use("/auth", auth);
app.use("/api", api);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const root = path.join(__dirname, "./client/public/index.html");

const PORT = process.env.PORT || 5000;

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    console.log("oops");
    res.status(200).json({ err: "Invalid token", ok: false });
  }
});
//app.get("/", function (req, res) {
//  res.sendFile(root);
//});

app.listen(PORT, () => {
  console.log(`Listening to PORT: ${PORT}`);
  console.log("Press Ctrl+C to exit");
});
