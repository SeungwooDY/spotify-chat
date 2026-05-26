import 'dotenv/config';
import express from 'express';
import querystring from 'querystring';
import crypto from 'crypto';

const router = express.Router();
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = 'http://127.0.0.1:3000/callback';
const frontend_uri = 'http://localhost:5173';

function generateRandomString(length) {
  return crypto.randomBytes(60).toString('hex').slice(0, length);
}

router.get('/login', (req, res) => {
  const state = generateRandomString(16);
  const scope = 'user-read-private user-read-email';
  
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
  const storedState = req.cookies? req.cookies['spotify_auth_state'] : null;

  if (state === null || state !== storedState) {
    return res.redirect(frontend_uri + '/callback#' +
      querystring.stringify({ error: 'state_mismatch' }));
  } 

  res.clearCookie('spotify_auth_state');
  
  try {
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
    res.redirect(frontend_uri + '/#' +
      querystring.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token
      }));
  } catch (err) {
    console.error(err);
    res.redirect(frontend_uri + '/#' + querystring.stringify({ error: 'invalid_token' }));
  }
});

router.get('/refresh_token', async (req, res) => {
  const refresh_token = req.query.refresh_token;

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
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

export default router;