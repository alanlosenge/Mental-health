const express = require('express');
const jwt = require('jsonwebtoken');
const JournalEntry = require('../models/JournalEntry');
require('dotenv').config(); // Make sure this is included

const router = express.Router();

// ✅ Middleware to verify JWT token correctly
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Use .env value
    req.userId = decoded.id; // ✅ This matches how you signed it in auth.js
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
}

// ✅ POST: Save a journal entry
router.post('/add', authMiddleware, async (req, res) => {
  const { mood, entry } = req.body; // "entry" should match frontend field

  try {
    const newEntry = await JournalEntry.create({
      userId: req.userId,
      mood,
      text: entry, // "text" is the DB field, "entry" is from frontend
    });
    res.status(201).json(newEntry);
  } catch (err) {
    console.error('Error saving journal entry:', err);
    res.status(500).json({ message: 'Failed to add journal entry' });
  }
});

// ✅ GET: Fetch all journal entries for logged-in user
router.get('/entries', authMiddleware, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.userId }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    console.error('Error fetching journal entries:', err);
    res.status(500).json({ message: 'Failed to fetch entries' });
  }
});

// GET: Mood stats for chart/calendar
router.get('/mood-stats', authMiddleware, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.userId });

    // Group by date
    const stats = {};
    entries.forEach(entry => {
      const date = new Date(entry.date).toISOString().split('T')[0]; // format: yyyy-mm-dd
      if (!stats[date]) stats[date] = {};
      stats[date][entry.mood] = (stats[date][entry.mood] || 0) + 1;
    });

    res.json(stats);
  } catch (err) {
    console.error('Error fetching mood stats:', err);
    res.status(500).json({ message: 'Failed to fetch mood stats' });
  }
});


module.exports = router;
