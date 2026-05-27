import 'dotenv/config';
import express from 'express';
import { createDiscussion, fetchAllDiscussions } from "../utils/forum.js";

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

// create a new post
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


export default router;