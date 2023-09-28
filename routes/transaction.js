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
router.put("/:transId", verifyToken, updateTransactions);
router.get("/", verifyToken, getTransactions);
router.get("/:transId", verifyToken, getTransaction);
router.delete("/:transId", verifyToken, deleteTrans);

module.exports = router;