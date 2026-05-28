import 'dotenv/config';
import express from 'express';
import querystring from 'querystring';
import crypto from 'crypto';
import db from '../firebase.js';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

const router = express.Router();
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI || 'http://127.0.0.1:3000/callback';
const frontend_uri = process.env.FRONTEND_URI || 'http://127.0.0.1:5173';

function generateRandomString(length) {
  return crypto.randomBytes(60).toString('hex').slice(0, length);
}

router.get('/login', (req, res) => {
  const state = generateRandomString(16);
  const scope = 'user-read-private user-read-email user-top-read';

  res.cookie('spotify_auth_state', state, { httpOnly: true });

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

router.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies['spotify_auth_state'] : null;

  if (state === null || state !== storedState) {
    return res.redirect(frontend_uri + '/callback#' +
      querystring.stringify({ error: 'state_mismatch' }));
  }

  res.clearCookie('spotify_auth_state');

  try {
    // 1. Exchange the authorization code for tokens
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      },
      body: new URLSearchParams({
        code,
        redirect_uri,
        grant_type: 'authorization_code'
      })
    });
    if (!tokenResponse.ok) throw new Error(`Spotify token error: ${tokenResponse.status}`);
    const data = await tokenResponse.json();

    // 2. Use access token to fetch user's Spotify profile
    const profileResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + data.access_token }
    });
    if (!profileResponse.ok) throw new Error(`Spotify profile error: ${profileResponse.status}`);
    const profile = await profileResponse.json();

    // 3. Add the user and tokens to Firestore
    await setDoc(doc(db, 'users', profile.id), {
      displayName: profile.display_name,
      email: profile.email,
      profileImage: profile.images?.[0]?.url || null,
      spotifyId: profile.id,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      lastLogin: new Date().toISOString(),
    }, { merge: true });

    // 4. Set session cookie so backend knows who's making future requests
    res.cookie('spotify_user_id', profile.id, { httpOnly: true });

    // 5. Redirect to frontend with tokens
    res.redirect(frontend_uri + '/callback#' +
      querystring.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token
      }));
  } catch (err) {
    console.error(err);
    res.redirect(frontend_uri + '/callback#' + querystring.stringify({ error: 'invalid_token' }));
  }
});

router.get('/refresh_token', async (req, res) => {
  const refresh_token = req.query.refresh_token;
  const userId = req.cookies?.spotify_user_id;

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token
      })
    });

    if (!response.ok) throw new Error(`Refresh failed: ${response.status}`);
    const data = await response.json();

    // Keep Firestore in sync so the token-based lookup stays valid
    if (userId) {
      await updateDoc(doc(db, 'users', userId), { accessToken: data.access_token });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

export default router;
