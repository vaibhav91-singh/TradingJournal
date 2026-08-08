const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const stream = require('stream');
const db = require('../db/database');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Keep file in memory

// Helper to get authenticated drive client
const getDriveService = (req) => {
  if (!req.session.tokens) return null;
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials(req.session.tokens);
  return google.drive({ version: 'v3', auth: oauth2Client });
};

// Upload new journal entry
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { title, text, quantity, entryPrice, exitPrice, stopLoss, target, outcome, entryTime, exitTime } = req.body;
    const file = req.file;
    const driveService = getDriveService(req);

    if (!driveService) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // 1. Upload image to Google Drive
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    const driveResponse = await driveService.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: file.mimetype,
      },
      media: {
        mimeType: file.mimetype,
        body: bufferStream,
      },
      fields: 'id',
    });

    const driveFileId = driveResponse.data.id;

    // 2. Make the file readable by anyone with the link (so frontend can show it)
    await driveService.permissions.create({
        fileId: driveFileId,
        requestBody: {
            role: 'reader',
            type: 'anyone',
        }
    });


    // 3. Save to database
    db.run(
      `INSERT INTO journals (title, text, driveFileId, quantity, entryPrice, exitPrice, stopLoss, target, outcome, entryTime, exitTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, text, driveFileId, quantity, entryPrice, exitPrice, stopLoss, target, outcome, entryTime, exitTime],
      function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ id: this.lastID, title, text, driveFileId, quantity, entryPrice, exitPrice, stopLoss, target, outcome, entryTime, exitTime });
      }
    );
  } catch (error) {
    console.error('Error uploading:', error);
    res.status(500).json({ error: 'Failed to upload' });
  }
});

// List all journals
router.get('/', (req, res) => {
  db.all(`SELECT * FROM journals ORDER BY createdAt DESC`, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Delete a journal
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const driveService = getDriveService(req);

    if (!driveService) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Find the driveFileId first
    db.get(`SELECT driveFileId FROM journals WHERE id = ?`, [id], async (err, row) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!row) return res.status(404).json({ error: 'Not found' });

      const { driveFileId } = row;

      // Delete from Drive (might fail if file already deleted manually, so we catch)
      try {
        await driveService.files.delete({ fileId: driveFileId });
      } catch (driveErr) {
        console.warn('Could not delete from drive, it might already be gone:', driveErr.message);
      }

      // Delete from database
      db.run(`DELETE FROM journals WHERE id = ?`, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// Proxy image from Google Drive to bypass embed restrictions
router.get('/image/:id', async (req, res) => {
  try {
    const driveService = getDriveService(req);
    if (!driveService) {
      return res.status(401).send('Not authenticated');
    }

    const fileId = req.params.id;
    
    const response = await driveService.files.get(
      { fileId: fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    response.data
      .on('end', () => {})
      .on('error', err => {
        console.error('Error downloading file.', err);
        if (!res.headersSent) res.status(500).send('Error downloading file');
      })
      .pipe(res);
  } catch (error) {
    console.error('Error fetching image from drive:', error.message);
    if (!res.headersSent) res.status(500).send('Failed to fetch image');
  }
});

module.exports = router;
