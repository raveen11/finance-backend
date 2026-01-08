// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

/* 🔹 Trust proxy for secure cookies on Render */
app.set('trust proxy', 1);

/* 🔹 Middleware */
app.use(express.json());

/* 🔹 CORS setup */
const allowedOrigins = [
  'http://localhost:3000', // local dev
  'https://finance-dashboard-webapp.vercel.app' // 🔹 REPLACE with your frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / server-to-server
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // allow cookies
}));

// Preflight handled automatically by cors()

/* 🔹 Test route */
app.get('/', (req, res) => {
  res.send('Finance App Backend Running!');
});

/* 🔹 Routes */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/person', require('./routes/personRoutes'));
app.use('/api/transaction', require('./routes/transactionRoutes'));

/* 🔹 MongoDB Connection (Mongoose 7+) */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

/* Optional: log connection errors */
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

/* 🔹 Start Server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
