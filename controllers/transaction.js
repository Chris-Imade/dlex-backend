const createError = require("../lib/error");
const Transaction = require("../schemas/Transaction");

// Create Transaction // userId should now be added to further created transactions on the request
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
      return res.status(200).json({ existingData: existingTransaction.uniqueIdentifier });
    }

  } catch (error) {
    next(error);
  }
};

// Update transaction
const updateTransactions = (req, res, next) => {
  const transactionId = req.params.transactionId;
  const newTransaction = req.body;
  const userId = req.query.userId;

  Transaction.findById(transactionId).then((transaction) => {
    if(transaction.userId === userId) {
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
    }
  }).catch(err => createError(403, 'You are not allowed to delete a transaction you did not create', err));
};

// Get all transactions
const getTransactions = (req, res, next) => {
  const userId = req.query.userId;

  Transaction.find({ userId })
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
  const userId = req.query.userId;

  Transaction.findById(transId)
    .then((trans) => {
      if(trans.userId === userId) {
        res.status(200).json(trans);
      } else {
        res.status(403).json({ message: 'You are not allowed to request this transaction', status: 403, detail: 'You can only request for transactions you created, our clients confidentiality is our top priority' })
      }
    })
    .catch((err) => {
      next(err);
    });
};

// Delete Transaction
const deleteTrans = (req, res, next) => {
  const transId = req.params.transactionId;
  const userId = req.query.userId;
  Transaction.findById(transactionId).then((transaction) => {
      if(transaction.userId === userId) {
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
    }
  })
    
};

module.exports = {
  createTransaction,
  updateTransactions,
  getTransactions,
  getTransaction,
  deleteTrans,
};
