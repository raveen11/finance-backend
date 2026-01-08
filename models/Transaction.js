// backend/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['deposit', 'withdrawal'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  purpose: {
    type: String,
    enum: ['Personal Loan', 'Trading', 'Real State Investment', 'Others'], // your allowed values here
    required: function() {
      // Only required if type is withdrawal
      return this.type === 'withdrawal';
    }
  },
  isMutual: {
    type: Boolean,
    required: function() {
      return this.type === 'withdrawal';
    }
  }

}, { timestamps: true });

// Index for faster queries
transactionSchema.index({ person: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);