// backend/controllers/transactionController.js
const Transaction = require('../models/Transaction');
const Person = require('../models/Person');
const mongoose = require('mongoose');
// Helper: Update person's totals after a transaction
const updatePersonTotals = async (personId) => {
    const totals = await Transaction.aggregate([
        { $match: { person: personId } },
    {
        $group: {
        _id: '$person',
        totalDeposited: { $sum: { $cond: [{ $eq: ['$type', 'deposit'] }, '$amount', 0] } },
        totalWithdrawn: { $sum: { $cond: [{ $eq: ['$type', 'withdrawal'] }, '$amount', 0] } }
    }
}
]);
console.log('ABCD-personId',totals,personId)

  const deposited = totals[0]?.totalDeposited || 0;
  const withdrawn = totals[0]?.totalWithdrawn || 0;
  const dueAmount = withdrawn > deposited ? withdrawn - deposited : 0;

  await Person.findByIdAndUpdate(personId, {
    totalDeposited: deposited,
    totalWithdrawn: withdrawn,
    dueAmount
  });
};

// Create Transaction (Deposit or Withdrawal)
const createTransaction = async (req, res) => {
  const { type, amount, personId, notes,purpose,isMutual } = req.body;
  const objectPersonId = new mongoose.Types.ObjectId(personId);


  try {
    const person = await Person.findById(personId);
    if (!person) return res.status(404).json({ message: 'Person not found' });

    const transaction = new Transaction({
      type,
      amount,
      person: personId,
      notes,
      purpose,
      isMutual
    });
    await transaction.save();

    // Update person's totals
    await updatePersonTotals(objectPersonId);

    res.status(201).json({success:true, transaction});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Transactions (global view)
const getAllTransactions = async (req, res) => {
      console.log('ABCD0001111111111',req,res)

  try {
    const transactions = await Transaction.find()
      .populate('person', 'name')
      .sort({ createdAt: -1 });

      console.log('ABCD0000',transactions)
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Transactions by Person
const getTransactionsByPerson = async (req, res) => {
  const { personId } = req.params;
  try {
    const transactions = await Transaction.find({ person: personId })
      .populate('person', 'name')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper: Update person's totals after a transaction
const getTotalAmounts = async (req, res) => {
  try {
    // 1️⃣ Total deposited and total withdrawn
    const totals = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalDeposited: {
            $sum: { $cond: [{ $eq: ['$type', 'deposit'] }, '$amount', 0] }
          },
          totalWithdrawn: {
            $sum: { $cond: [{ $eq: ['$type', 'withdrawal'] }, '$amount', 0] }
          }
        }
      }
    ]);

    const deposited = totals[0]?.totalDeposited || 0;
    const withdrawn = totals[0]?.totalWithdrawn || 0;
    const totalInAccount = deposited - withdrawn;

    // 2️⃣ Withdrawn amount according to purpose (only for isMutual: true)
    const withdrawnByPurpose = await Transaction.aggregate([
      { $match: { type: 'withdrawal', isMutual: true } },
      {
        $group: {
          _id: '$purpose',
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Convert to a cleaner object: { food: 100, rent: 50, ... }
    const withdrawnByPurposeObj = {};
    withdrawnByPurpose.forEach(item => {
      withdrawnByPurposeObj[item._id] = item.total;
    });

    res.json({
      totalDeposited: deposited,
      totalWithdrawn: withdrawn,
      totalInAccount,
      withdrawnByPurpose: withdrawnByPurposeObj
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionsByPerson,
  getTotalAmounts,
};