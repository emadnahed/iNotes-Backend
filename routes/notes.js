const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
// importing the notes model
const Note = require("../models/Note");
// importing the validator to verify the data input by user
const { body, validationResult } = require("express-validator");

// Route-1 Get all the notes using: GET  "/fetchallnotes" Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    // getting the notes from the database
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    // ideally we store it in Logger or SQS
    res.status(500).send("INTERNAL SERVER ERROR: Unable to fetch the notes");
  }
});

// Route-2 Create a new note using: POST  "/createnote" Login required
router.post(
  "/createnote",
  [
    body("description", "The Description must be at least of 5 characters").isLength({ min: 5 }),
    body("title", "The Titles must be at least of 3 characters").isLength({ min: 3 }),
  ],
  fetchuser,
  async (req, res) => {
    const { title, description, tag } = req.body;
    // if there are errors, send a bad request in response
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const note = new Note({
        title,
        description,
        tag:  tag || "General",
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      // ideally we store it in Logger or SQS
      console.error(error);
      res.status(500).send("INTERNAL SERVER ERROR: Unable to write the notes");
    }
  }
);

// Route-3 Update an existing note using: POST  "/updatenote" Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // note is now a temporary variable which will help us find the note details using the params id of the note sent by the client
    let note = await Note.findById(req.params.id);
    // Finding if that  note exists
    if (!note) {
      return res.status(404).send("Not found");
    }

    // Finding if the note belongs to the user who logged in
    // req.user.id is being found by the middleware by auth-token being decoded.
    // note.user.toString()  will give us a string of ids which can be compared with our user id.
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    // note is now redefined as the updated new note
    note = await Note.findByIdAndUpdate(req.params.id, { ...newNote }, { new: true });
    // or
    // note = await Note.findByIdAndUpdate(req.params.id ,{$set: newNote}, {new:true})

    res.json({ note });
  } catch (err) {
    // ideally we store it in Logger or SQS
    console.error(error.message);
    res.status(500).send("INTERNAL SERVER ERROR: Unable to write the notes");
  }
});

// Route-3 Delete an note using: DELETE  "/updatenote" Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    // note is now a temporary variable which will help us find the note details using the params id of the note sent by the client
    let note = await Note.findById(req.params.id);

    // Finding if that note exists
    if (!note) {
      return res.status(404).send("Not found");
    }

    // Finding if the note belongs to the user who logged in
    // req.user.id is being found by the middleware by auth-token being decoded.
    // note.user.toString()  will give us a string of ids which can be compared with our user id.
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    // note is now redefined as the updated new note
    note = await Note.findByIdAndDelete(req.params.id);
    // or
    // note = await Note.findByIdAndUpdate(req.params.id ,{$set: newNote}, {new:true})
    res.json({ Message: "Deleted Successfully!, deletion reference is: ", note: note._id });
  } catch (err) {
    // ideally we store it in Logger or SQS
    console.error(error.message);
    res.status(500).send("INTERNAL SERVER ERROR: Unable to write the notes");
  }
});

module.exports = router;
