// backend/models/Person.js
const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    default: ''
  },
  interestRate: {
    type: Number,     // e.g., 5 for 5% (only used for withdrawals/loans if needed)
    default: 0
  },
  // We can calculate these on the fly, but storing them makes queries faster
  totalDeposited: {
    type: Number,
    default: 0
  },
  totalWithdrawn: {
    type: Number,
    default: 0
  },
  dueAmount: {
    type: Number,     // If someone borrows (withdrawn > deposited + interest)
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Person', personSchema);