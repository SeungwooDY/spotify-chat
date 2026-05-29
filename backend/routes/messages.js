import express from 'express';
import db from '../firebase.js';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import {
  findOrCreateConversation,
  getConversationsForUser,
  getMessages,
  sendMessage,
} from '../utils/messages.js';

const router = express.Router();

async function getUserData(req) {
  const userId = req.cookies?.spotify_user_id;
  if (userId) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) return { id: userId, ...userDoc.data() };
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const accessToken = authHeader.slice(7);
    const snapshot = await getDocs(
      query(collection(db, 'users'), where('accessToken', '==', accessToken))
    );
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    }
  }

  return null;
}

// GET /messages/conversations - list current user's conversations
router.get('/conversations', async (req, res) => {
  const userData = await getUserData(req);
  if (!userData) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const conversations = await getConversationsForUser(userData.id);
    res.json(conversations);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// POST /messages/conversations - create or find a conversation with another user
router.post('/conversations', async (req, res) => {
  const userData = await getUserData(req);
  if (!userData) return res.status(401).json({ error: 'Not authenticated' });

  const { recipientId } = req.body;
  if (!recipientId) return res.status(400).json({ error: 'recipientId is required' });
  if (recipientId === userData.id) return res.status(400).json({ error: 'Cannot message yourself' });

  try {
    const conversation = await findOrCreateConversation(userData.id, recipientId);
    res.json(conversation);
  } catch (err) {
    console.error('Error creating conversation:', err);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// GET /messages/conversations/:id - get messages in a conversation
router.get('/conversations/:id', async (req, res) => {
  const userData = await getUserData(req);
  if (!userData) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const messages = await getMessages(req.params.id);
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /messages/conversations/:id - send a message
router.post('/conversations/:id', async (req, res) => {
  const userData = await getUserData(req);
  if (!userData) return res.status(401).json({ error: 'Not authenticated' });

  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'text is required' });

  try {
    const message = await sendMessage(req.params.id, userData.id, text.trim());
    res.json(message);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
