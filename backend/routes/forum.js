import 'dotenv/config';
import express from 'express';
import { createDiscussion, fetchAllDiscussions, createReply, getReplies } from "../utils/forum.js";

const router = express.Router();

// get all posts
router.get("/", async(req, res) => {
  try {
    const posts = await fetchAllDiscussions();
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({message: "Error retrieving posts"});
  }
});

// create a new discussion board
router.post("/", async(req, res) => {
  try {
    const { user_id, user_display, title, message } = req.body;

    if (!user_id || !user_display || !message || !title) {
      if (!user_id) console.log("no user id");
      return res.status(400).json({ error: 'username, message, and title are all required' });
    }

    const docRef = await createDiscussion(req.body);
    res.status(201).json(docRef);
  } catch (error) {
    // This prints err in backend terminal
    console.error("Backend Error in POST /posts:", error); 
    
    // Sends the error message back to React for easier debugging
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
})

// create a response to a discussion post
router.post("/reply", async(req, res) => {
  try {
    const {discussion_id, message, user_display, user_id} = req.body;
    if (!discussion_id || !message || !user_display || !user_id) {
      return res.status(400).json({error: 'discussion id, message, user_display, and user_id are all required'} );
    }
    await createReply(req.body);
  } catch (error) {
    // print in backend
    console.error("Backend error in posting a forum reply: ", error);
    // send back to react
    res.status(500).json({ message: 'Error in posting forum reply', error: error.message });
  }
})

// grab responses to a discussion post
router.get("/reply", async(req, res) => {
  try {
    const {discussion_id} = req.query;
    if (!discussion_id) {
      return res.status(400).json({error: "discussion id is required"});
    }
    const replies = await getReplies(discussion_id);
    res.status(200).json(replies)
  } catch (error) {
    console.error("backend error in getting forum replies: ", error);
    res.status(500).json({ message: 'Error in getting forum replies ', error: error.message });
  }
})


export default router;