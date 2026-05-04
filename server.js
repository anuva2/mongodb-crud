const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const path      = require('path');

const app = express();

// ── MIDDLEWARE ───────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── DATABASE ─────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/library_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log(`✅  MongoDB connected → ${MONGO_URI}`))
  .catch(err => {
    console.error('❌  MongoDB connection failed:', err.message);
    console.error('   Make sure MongoDB is running or that MONGO_URI is configured.');
    process.exit(1);
  });

// ── ROUTES ───────────────────────────────────────────────
app.use('/api/authors', require('./routes/authors'));
app.use('/api/genres',  require('./routes/genres'));
app.use('/api/books',   require('./routes/books'));

// Serve the frontend UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── START ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀  Server running at http://localhost:${PORT}`);
  console.log(`\n📚  API endpoints:`);
  console.log(`   GET    /api/authors`);
  console.log(`   POST   /api/authors`); 
  console.log(`   GET    /api/authors/:id   (with their books)`);
  console.log(`   PUT    /api/authors/:id`);
  console.log(`   DELETE /api/authors/:id   (cascades to books)`);
  console.log(`\n   GET    /api/genres`);
  console.log(`   POST   /api/genres`);
  console.log(`   GET    /api/genres/:id    (with tagged books)`);
  console.log(`   DELETE /api/genres/:id   ($pull from all books)`);
  console.log(`\n   GET    /api/books        (populated author + genres)`);
  console.log(`   POST   /api/books`);
  console.log(`   GET    /api/books/:id`);
  console.log(`   PUT    /api/books/:id`);
  console.log(`   DELETE /api/books/:id`);
  console.log(`   GET    /api/books/aggregate/stats  (raw $lookup)`);
});
