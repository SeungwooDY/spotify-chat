import express from 'express';
import db from '../firebase.js';
import { doc, getDoc } from 'firebase/firestore';

const router = express.Router();

// Reads session cookie to look up user's access token from Firestore
async function getUserToken(req) {
  const userId = req.cookies?.spotify_user_id;
  if (!userId) return null;

  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return null;

  return userDoc.data().accessToken;
}

// GET /api/top-tracks
router.get('/top-tracks', async (req, res) => {
  const accessToken = await getUserToken(req);
  if (!accessToken) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const { time_range = 'medium_term', limit = 20 } = req.query;

    const response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=${limit}`, {
        headers: { 'Authorization': 'Bearer ' + accessToken }
      }
    );

    if (!response.ok) throw new Error(`Spotify error: ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
});

export default router;
