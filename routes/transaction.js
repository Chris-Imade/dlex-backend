const express = require('express');
const { 
    createTransaction, 
    updateTransactions, 
    getTransactions,
    getTransaction,
    deleteTrans
} = require('../controllers/transaction');
const { verifyToken } = require('../lib/verifyToken');

const router = express.Router();

router.post("/", verifyToken,createTransaction);
router.put("/:transactionId", verifyToken, updateTransactions);
router.get("/", verifyToken, getTransactions);
router.get("/:transactionId", verifyToken, getTransaction);
router.delete("/:transactionId", verifyToken, deleteTrans);

module.exports = router;