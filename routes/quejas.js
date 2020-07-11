const mongoose = require("mongoose");
const expres = require("express");
const auth = require("../utils/auth");
const Queja = require("../models/queja");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const router = expres.Router();

mongoose.connect("mongodb://127.0.0.1/libro_reclamos", {
  useNewUrlParser: true,
});

router.post("/send", auth, (req, res) => {
  const { user, queja } = req.body;

  const quejaJwt = jwt.sign({ queja }, "Quejon");
  return User.findById(user)
    .exec()
    .then((doc) => {
      return Queja.create({
        desdeId: req.user.id,
        desdeName: req.user.name,
        haciaId: user,
        queja: quejaJwt,
      })
        .then((doc) => {
          return res.json({
            message: "Queja realizada correctamente",
            id: doc._id,
          });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ message: err.message });
        });
    })
    .catch((er) => {
      console.error("User not found");
      res.status(500).json({ error: "User not found" });
    });
});

router.get("/get", auth, (req, res) => {
  const quejas = [];
  Queja.find({ haciaId: req.user.id })
    .exec()
    .then((docs) => {
      docs.forEach((doc) => {
        const docaux = {
          desdeName: doc.desdeName,
          desdeId: doc.desdeId,
          queja: jwt.verify(doc.queja, "Quejon").queja,
        };
        quejas.push(docaux);
      });
      return res.json({ quejas });
    });
});

router.post("/delete", auth, (req, res) => {
  const { queja } = req.body;
  return Queja.findByIdAndDelete(queja)
    .then(() => {
      return res.json({ message: "Queja eliminada correctamente" });
    })
    .catch((e) => {
      console.error(e);
      return res.json({ message: "Queja inexistente" });
    });
});

module.exports = router;
