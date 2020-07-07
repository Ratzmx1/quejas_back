const mongo = require("mongoose");

const queja = mongo.Schema({
  desdeId: {
    type: String,
  },
  desdeName: {
    type: String,
  },
  haciaId: {
    type: String,
  },
  queja: {
    type: String,
  },
});

module.exports = mongo.model("quejas", queja);
