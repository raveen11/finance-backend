const express = require('express');
const { createTransaction, getAllTransactions, getTotalAmounts } = require('../controllers/transactionController');

const router = express.Router();
//transaction routes
router.post('/create', createTransaction);
router.get('/getAll', getAllTransactions);
router.get('/getTotalAmounts', getTotalAmounts);


module.exports = router;