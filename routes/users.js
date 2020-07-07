const express = require("express");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user");

mongoose.connect("mongodb://127.0.0.1/libro_reclamos", {
  useNewUrlParser: true,
});

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, birthDate, email, password, city } = req.body;
  const hash = bcrypt.hashSync(password, 1);
  return User.find({ email })
    .exec()
    .then((docs) => {
      if (docs.length > 0) {
        return res.status("300").json({ error: "User already registred" });
      }
      return User.create({ name, email, password: hash, birthDate, city }).then(
        (doc) => {
          const token = jwt.sign(
            {
              name: doc.name,
              birthDate: doc.birthDate,
              email,
              city: doc.city,
              id: doc._id,
            },
            "This its a secret",
            { expiresIn: 60 * 60 * 24 * 15 } // 15 dias
          );
          return res.json({ token });
        }
      );
    });
});

router.get("/", (req, res) => {
  return User.find()
    .exec()
    .then((docs) => {
      return res.json({ docs });
    })
    .catch((e) => {
      console.error(e);
      return res.status(500).json({ error: e.message });
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
