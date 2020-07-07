const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const usersRouter = require("./routes/users");
const quejaRouter = require("./routes/quejas");

const app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/user", usersRouter);
app.use("/queja", quejaRouter);

app.listen(3031, function () {
  console.log("Listen on port 3030");
});
