import express from "express";
import db from "../firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const router = express.Router();

// Resolves user from session cookie first, then Authorization header fallback.
// The header fallback handles dev environments where the cookie host mismatches.
async function getUserData(req) {
  const userId = req.cookies?.spotify_user_id;
  if (userId) {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) return { id: userId, ...userDoc.data() };
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const accessToken = authHeader.slice(7);
    const snapshot = await getDocs(
      query(collection(db, "users"), where("accessToken", "==", accessToken))
    );
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    }
  }

  return null;
}

// GET /api/me — returns profile from Firestore (data was saved during login)
router.get("/me", async (req, res) => {
  const userData = await getUserData(req);
  if (!userData) return res.status(401).json({ error: "Not authenticated" });

  if (!req.cookies?.spotify_user_id) {
    res.cookie("spotify_user_id", userData.id, { httpOnly: true });
  }

  res.json({
    id: userData.id,
    display_name: userData.displayName || null,
    email: userData.email || null,
    images: userData.profileImage ? [{ url: userData.profileImage }] : [],
  });
});

// GET /api/top-artists
router.get("/top-artists", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const { time_range = "medium_term", limit = 4 } = req.query;
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!response.ok) throw new Error(`Spotify error: ${response.status}`);
    res.json(await response.json());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top artists" });
  }
});

// GET /api/top-tracks
router.get("/top-tracks", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const { time_range = "medium_term", limit = 20 } = req.query;
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!response.ok) throw new Error(`Spotify error: ${response.status}`);
    res.json(await response.json());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top tracks" });
  }
});

// GET /api/profile — current user's saved profile settings from Firestore
router.get("/profile", async (req, res) => {
  const userData = await getUserData(req);
  if (!userData) return res.status(401).json({ error: "Not authenticated" });

  res.json({
    bio: userData.bio || "",
    isPublic: userData.isPublic !== false,
    featuredArtists: userData.featuredArtists || [],
    featuredTracks: userData.featuredTracks || [],
  });
});

// POST /api/profile/photo — upload a profile photo (base64) and store in Firestore
router.post("/profile/photo", async (req, res) => {
  const userData = await getUserData(req);
  if (!userData) return res.status(401).json({ error: "Not authenticated" });

  const { image } = req.body;
  if (!image?.startsWith("data:image/")) {
    return res.status(400).json({ error: "Invalid image data" });
  }

  try {
    await updateDoc(doc(db, "users", userData.id), { profileImage: image });
    res.json({ url: image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save photo" });
  }
});

// PUT /api/profile — save current user's profile settings to Firestore
router.put("/profile", async (req, res) => {
  const userData = await getUserData(req);
  if (!userData) return res.status(401).json({ error: "Not authenticated" });
  const userId = userData.id;

  const { bio, isPublic, featuredArtists, featuredTracks } = req.body;

  try {
    await updateDoc(doc(db, "users", userId), {
      bio: bio ?? "",
      isPublic: isPublic ?? true,
      featuredArtists: featuredArtists ?? [],
      featuredTracks: featuredTracks ?? [],
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

// GET /api/liked-songs
router.get('/liked-songs', async (req, res) => {
  const userData = await getUserData(req);  
  if (!userData) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const { offset = 0, limit = 50 } = req.query;

    const response = await fetch(
      `https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=${limit}`, {
        headers: { 'Authorization': 'Bearer ' + userData.accessToken }
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
