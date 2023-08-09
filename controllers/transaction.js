const Transaction = require("../schemas/Transaction");

// Create Transaction
const createTransaction = async (req, res, next) => {
  const transData = req.body;

  try {
    const existingTransaction = await Transaction.findOne({ uniqueIdentifier: transData.uniqueIdentifier }); 

    if(!existingTransaction)  {
        const newTransaction = new Transaction(transData);
    
        await newTransaction.save({ new: true });
        res
          .status(201)
          .json({
            message: "Success",
            status: 201,
            detail: "Transaction successfully created",
          });
    } else {
      return res.status(200).json({ existingData: existingTransaction.uniqueIdentifier});
    }

  } catch (error) {
    next(error);
  }
};

// Update transaction
const updateTransactions = (req, res, next) => {
  const transactionId = req.params.transactionId;
  const newTransaction = req.body;

  Transaction.findByIdAndUpdate(
    transactionId,
    { $set: newTransaction },
    { new: true }
  )
    .then((transaction) => {
      res.status(201).json({
        message: "Success",
        status: 200,
        detail: "Transaction successfully updated",
      });
    })
    .catch((err) => {
      next(err);
    });
};

// Get all transactions
const getTransactions = (req, res, next) => {
  Transaction.find()
    .then((transactions) => {
      res.status(200).json(transactions);
    })
    .catch((err) => {
      next(err);
    });
};

// Get single Transaction
const getTransaction = (req, res, next) => {
  const transId = req.params.transactionId;

  Transaction.findById(transId)
    .then((trans) => {
      res.status(200).json(trans);
    })
    .catch((err) => {
      next(err);
    });
};

// Delete Transaction
const deleteTrans = (req, res, next) => {
  const transId = req.params.transactionId;

  Transaction.findByIdAndDelete(transId)
    .then(() => {
      res
        .status(200)
        .json({
          message: "Success",
          status: 200,
          detail: "Transaction Successfully deleted",
        });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  createTransaction,
  updateTransactions,
  getTransactions,
  getTransaction,
  deleteTrans,
};
