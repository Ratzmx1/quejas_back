const mongo = require("mongoose");

const user = mongo.Schema({
  name: {
    type: String,
  },
  birthDate: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  city: {
    type: String,
  },
});

module.exports = mongo.model("users", user);
