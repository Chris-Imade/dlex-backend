const createError = require("../lib/error");
const Transaction = require("../schemas/Transaction");
const User = require("../schemas/User");

// Create User Centric Transactions
const createTransaction = async (req, res, next) => {
  const transData = req.body;
  const currentUserId = req.query.userId; // Get the User's ID
  console.log('currentUserId: ', currentUserId);

  try {
    const existingTransaction = await Transaction.findOne({
      uniqueIdentifier: transData.uniqueIdentifier,
    });

    if (!existingTransaction) {
      const newTransaction = new Transaction(transData);

      await newTransaction.save();

      // Get the user's document to fit transaction right in
      const user = await User.findById(currentUserId);
      console.log("newTransaction: ", newTransaction);

      // Store the just created Transaction in the User's Document
      user.transactions.push(newTransaction); // Now the Transaction has been added to it's specific User
      await user.save();

      return res.status(201).json({
        message: "Success",
        status: 201,
        detail: "Transaction successfully created",
      });
    } else {
      return res
        .status(200)
        .json({ existingData: existingTransaction.uniqueIdentifier });
    }
  } catch (error) {
    next(error);
  }
};

// Update created Transactions
const updateTransactions = async (req, res, next) => {
  const transactionId = req.params.transId;
  const updatedTrans = req.body;
  const currentUserId = req.query.userId;

  try {
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User Not Found", status: 404 });
    }

    // Find the transaction within the user's document
    const transactionIndex = currentUser.transactions.findIndex(
      (trans) => trans._id.toString() === transactionId
    );

    if (transactionIndex === -1) {
      return res
        .status(404)
        .json({ message: "Transaction Not Found", status: 404 });
    }
    // Updated the transaction data
    currentUser.transactions[transactionIndex] = {
      ...currentUser.transactions[transactionIndex],
      ...updatedTrans,
    };

    await currentUser.save();

    res.status(200).json(currentUser.transactions[transactionIndex]);
  } catch (error) {
    next(error);
  }
};

// Get Transactions
const getTransactions = async (req, res, next) => {
  const currentUserId = req.query.userId; // Getting the user's ID

  try {
    // Finding current User
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User Not Found", status: 404 });
    }

    // Access the transactions list from the user
    const transactions = currentUser.transactions;
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

// Get Transaction
const getTransaction = async (req, res, next) => {
  const currentUserId = req.query.userId;
  const transId = req.params.transId;

  try {
    // Find the currentUser based on Id
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User Not Found", status: 404 });
    }


    // Find the transaction within the user's transaction array by it's id
    const transaction = currentUser.transactions.find((trans) => trans._id.toString() === transId);


    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction Not Found", status: 404 });
    }

    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

// Delete Transaction
const deleteTrans = async (req, res, next) => {
  const currentUserId = req.query.userId;
  const transId = req.params.transId;

  try {
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User Not Found", status: 404 });
    }

    // We'd get the index of the transaction
    const transIndex = currentUser.transactions.findIndex((trans) =>
      trans._id.toString() === transId
    );
    if (transIndex === -1) {
      return res
        .status(404)
        .json({ message: "Transaction Not Found", status: 404 });
    }

    await currentUser.transactions.splice(transIndex, 1);
    await Transaction.findByIdAndDelete(transId);
    currentUser.save();

    res.status(200).json({
      message: "Success",
      status: 200,
      detail: "Transaction Successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  updateTransactions,
  getTransaction,
  getTransactions,
  deleteTrans,
};
