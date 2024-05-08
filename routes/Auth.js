const express = require("express");
const router = express.Router();
const User = require("../models/User");
// express validator is  used to validate user input in the signup form
const { body, validationResult } = require("express-validator");
// importing bcrypt js for hashing passwords, adding salts and pepper
const bcrypt = require("bcrypt");

// A middleware function that checks if a user is authentic, a secure connection between client and server to authenticate a session.
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = `NKXEVzywAluVCh2QyynpFbH3eFKyN6kFfe0wXW2Q`;

// Route-1 Create a user using: POST  "/api/auth" Doesn't require Login

// Validation of the request added
// Error messages added
// An array of validation is added after endpoint declaration
// three conditions of check are being checked.
// If errors occur while validation, it will be stored in errors variable through validationResult and will be checked if not empty,
// If not empty will return a 400 error response.

router.post(
  "/createuser",
  [
    body("email", "enter a valid email").isEmail(),
    body("name", "enter a valid name").isLength({ min: 3 }),
    body("password", "passwords are atleast 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // If error occurs while validation of the requirements then return bad request and the errors
    const errors = validationResult(req);
    let success = false
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Route-1 Check whether the user with the same email exists
    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res.status(400).json({ error: "User already exists" });
      }
      // Save new user into database if  it doesn't exist

      const salt = await bcrypt.genSalt(10);
      const securePass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
      });

      //   Data with the id  of created user returned to client side within a JWT
      const data = {
        user: {
          id: user.id,          
        },
      };

      // We've created a JWT below to authenticate
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true
      res.json({ authToken, success });
    } catch (error) {
      console.error(error.message);
      // ideally we store it in Logger or SQS
      res.status(500).send("INTERNAL SERVER ERROR");
    }
  }
);

// Route-2 Authenticte a user using: POST  "/api/login" Doesn't require Login
router.post(
  "/login",
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "Passwords cannot be empty").exists(),
  ],
  async (req, res) => {
    let success = false
    // If error occurs while validation of the requirements then return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Checking if the user exists by email
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({
            errors: "Please retry logging in with the correct credentials",
          });
      }

      // Password comparison if is correct, inclusive of all salts and pepper mechanisms
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({
            errors: "Please retry logging in with the correct credentials",
          });
      }

      // Data with the id  of created user returned to client side within a JWT
      const data = {
        user: {
          id: user.id,          
        },
      };

      // We've created a JWT below to authenticate
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true
      res.json({ authToken, success });
    } catch (error) {
      console.error(error.message);
      // ideally we store it in Logger or SQS
      res.status(500).send("INTERNAL SERVER ERROR");
    }
  }
);

// Route-3 get logged in user details using: POST  "/api/getuser" -Requires Login
router.post("/getuser", fetchuser, async (req, res) => {  
    try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json({user});
  } catch (error) {
    console.error(error.message);
    // ideally we store it in Logger or SQS
    res.status(500).send("INTERNAL SERVER ERROR");
  }
});

module.exports = router;
