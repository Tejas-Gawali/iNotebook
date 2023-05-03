const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//Route 1
// get all the notes of logged in user using GET "/api/notes/fetchallnotes"  Login Required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    }catch (error) {
        console.log(error.message)
        res.status(500).send("Some erroe occured")
      }
  
});

//Route 2
//add a new note  using post "/api/notes/addnote"  Login Required
router.post(
  "/addnote",
  fetchuser,
  [
    // validate if response is correct
    body("title", "Enter a valid title").isLength({ min: 1 }),
    body("description", "description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // if there are errors return bad request and errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    }catch (error) {
        console.log(error.message)
        res.status(500).send("Some erroe occured")
    }
  }
);


//Route 3
//update note  using put "/api/notes/updatenote"  Login Required
router.put("/updatenote/:id",fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    // find the note to be updated and update it
    let  note = await Notes.findById(req.params.id);
    if(!note){ return res.status(404).send("Not Found")};
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(req.params.id,{$set : newNote}, {new:true});
    res.json({note});
    }catch (error) {
        console.log(error.message)
        res.status(500).send("Some erroe occured")
    }
    

}) ;


//Route 4
//deleyte note  using delete "/api/notes/deletenote"  Login Required
router.delete("/deletenote/:id",fetchuser, async (req, res) => {
    
    try {
        // find the note to be deleted and delete it
    let  note = await Notes.findById(req.params.id);
    if(!note){ return res.status(404).send("Not Found")};

    //allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({"Success":"Note has been deleted",note:note});
    }catch (error) {
        console.log(error.message)
        res.status(500).send("Some erroe occured")
    }

    

}) ;

module.exports = router;
