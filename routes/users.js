const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

mongoose.connect("mongodb://127.0.0.1/libro_reclamos", {
  useNewUrlParser: true,
});

const User = require("../schema/user");
const user = require("../schema/user");

router.post("/signup", async (req, res) => {
  const { name, birthDate, email, password, city } = req.body;
  console.log("Hashing");
  const hash = bcrypt.hashSync(password, 1);
  return User.find({ email })
    .exec()
    .then((docs) => {
      if (docs.length > 0) {
        return res.status("300").json({ error: "User already registred" });
      }
      return User.create({ name, email, password: hash, birthDate, city }).then(
        (doc) => {
          return res.json({ name, email, password, hash });
        }
      );
    });
});

router.get("/", (req, res) => {
  return User.find({ email: req.body.email })
    .exec()
    .then((docs) => {
      return res.json({ docs });
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  return User.find({ email })
    .exec()
    .then((docs) => {
      if (docs.length === 0) {
        return res.json({ error: "Invalid email y/o password" });
      }
      const r = bcrypt.compareSync(password, docs[0].password);
      if (r) {
        const token = jwt.sign(
          {
            name: docs[0].name,
            birthDate: docs[0].birthDate,
            email,
            city: docs[0].city,
            id: docs[0]._id,
          },
          "This its a secret",
          { expiresIn: 60 * 60 * 24 * 15 } // 15 dias
        );
        return res.json({ token });
      }
      return res.json({ error: "invalid email y/o password" });
    });
});

module.exports = router;
