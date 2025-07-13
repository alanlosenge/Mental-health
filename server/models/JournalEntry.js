const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now }, // store as Date object
  mood: { type: String, enum: ['Happy', 'Sad', 'Stressed', 'Anxious', 'Neutral'], required: true },
  text: { type: String }, // this should match what's sent in your POST route
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
