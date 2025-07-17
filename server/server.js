const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // ✅ Load .env

const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journal');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static frontend files from ../public
app.use(express.static(path.join(__dirname, '..', 'public')));

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);

// ✅ Frontend route handlers
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html')); // Home page
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

app.get('/signup.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
});

// ✅ Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
})
.catch((err) => {
  console.error('❌ Database connection error:', err);
});
