const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // ✅ Required to serve static files
require('dotenv').config(); // ✅ Load .env

const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journal');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve frontend static files from the current folder
app.use(express.static(path.join(__dirname, '/')));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);

// ✅ Fallback to frontend (send home.html when someone accesses "/")
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Or index.html if renamed
});

// ✅ Connect to MongoDB Atlas
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
