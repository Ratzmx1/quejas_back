const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  const verified = jwt.verify(token, "This its a secret", (err, decoded) => {
    if (err) {
      return res.json({ message: "JWT invalido" });
    } else {
      const { name, birthDate, email, city, id } = decoded;
      req.user = { name, birthDate, email, city, id };
      next();
    }
  });
};
