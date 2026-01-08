const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.set('trust proxy', 1)
const allowedOrigins = [
  'http://localhost:3000',
  'https://finance-dashboard-webapp.onrender.com'
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true) // allow Postman / server calls
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.options('*', cors())



// Test route
app.get('/', (req, res) => {
  res.send('Finance App Backend Running!');
});


//connect routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/person', require('./routes/personRoutes'));
app.use('/api/transaction', require('./routes/transactionRoutes'));




// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));