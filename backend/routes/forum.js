import 'dotenv/config';
import express from 'express';
import { createDiscussion, updateReply, fetchAllDiscussions, createReply, getReplies, deleteDiscussion, likeDiscussion, deleteReply } from "../utils/forum.js";

const router = express.Router();

// ----- Discussion Board Endpoints ---- //

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

// delete a discussion board and all replies
router.delete("/", async(req, res) => {
  const { discussion_id } = req.query;
  if (!discussion_id) {
    return res.status(400).json({error: 'discussion id is required'});
  }
  try {
    await deleteDiscussion(discussion_id);
    res.status(200).json({success: true})
  } catch (error) {
    console.error("backend error in deleting discussion post", error);
    res.status(500).json({message: "error in deleting forum post", error: error.message});
  }
})

// update the likes of a discussion post
router.put("/likes", async(req, res) => {
  try {
    await likeDiscussion(req.body);
    res.status(200).json({success: true})
  } catch (error) {
    console.error("backend error in updating discussion likes: ", error);
    res.status(500).json({message: 'error in updating forum discussion likes', error: error.message});
  }
})

// ------ Response Endpoints ------ //


// create a response to a discussion post
router.post("/reply", async(req, res) => {
  try {
    const {discussion_id, message, user_display, user_id} = req.body;
    if (!discussion_id || !message || !user_display || !user_id) {
      return res.status(400).json({error: 'discussion id, message, user_display, and user_id are all required'} );
    }
    const docRef = await createReply(req.body);
    res.status(200).json({success: true, reply_id: docRef.id});
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

// delete a reply
router.delete("/reply", async(req, res) => {
  const {reply_id} = req.query;
  if (!reply_id) return res.status(400).json({error: "response id required"});

  try {
    await deleteReply(reply_id);
    res.status(200).json({success: true})
  } catch (error) {
    console.error("backend error in deleting the reply ", error);
    res.status(500).json({message: "Error in deleting forum reply", error: error.message});
  }
})

// update an old reply
router.put("/reply", async(req, res) => {
  try {
    await updateReply(req.body);
    res.status(200).json({success: true})
  } catch (error) {
    console.error("backend error in updating reply: ", error);
    res.status(500).json({message: 'error in updating forum reply', error: error.message});
  }
})



export default router;