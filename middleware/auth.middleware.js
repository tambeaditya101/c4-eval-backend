const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    res.status(404).send({ msg: "token not found" });
  }
  jwt.verify(token, "aditya", (err, decode) => {
    if (err) {
      res.status(400).send({ msg: err.message });
    }
    if (decode) {
      req.body.autherId = decode.autherId;
      next();
    } else {
      res.status(400).send({ msg: "Invalid token" });
    }
  });
};

module.exports = { auth };
