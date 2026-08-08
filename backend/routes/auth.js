const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

function getOAuth2Client() {
  const clientId = (process.env.GOOGLE_CLIENT_ID || '').trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
  const redirectUri = (process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback').trim();

  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );
}

// Generate an OAuth URL and redirect there
router.get('/google', (req, res) => {
  const oauth2Client = getOAuth2Client();
  const redirectUri = (process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback').trim();
  console.log('Generating OAuth URL with redirectUri:', redirectUri);
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/drive.file'
    ]
  });
  res.redirect(url);
});

// Handle the OAuth 2.0 server response
router.get('/google/callback', async (req, res) => {
  const oauth2Client = getOAuth2Client();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // In a real app, save tokens to DB associated with the user
    req.session.tokens = tokens; 
    res.redirect(`${frontendUrl}/dashboard`); // Redirect to frontend
  } catch (error) {
    console.error('Error retrieving access token', error);
    res.status(500).send('Authentication failed');
  }
});

router.get('/status', (req, res) => {
  if (req.session && req.session.tokens) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

module.exports = router;
