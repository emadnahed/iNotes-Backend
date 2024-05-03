const jwt = require("jsonwebtoken");
const JWT_SECRET = `NKXEVzywAluVCh2QyynpFbH3eFKyN6kFfe0wXW2Q`;

const fetchuser = (req, res, next) => {
  // Get the user from the jwt toke and add id to the request
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send("Access Denied! Please Login First!");
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send("Please authenticate using a valid token!");
  }
};

module.exports = fetchuser;
