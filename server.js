const express = require("express");
const dbConnection = require("./config/database").connection;
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/user");
const transactionRoute = require("./routes/transaction");
const productRoute = require("./routes/product");
const reportRoute = require('./routes/report');

const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors({ origin: "http://localhost:1212" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));

// Add the following middleware to enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:1212");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/transaction", transactionRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/reports", reportRoute);

app.use("/", (req, res) => {
  res.send("This app runs fine 😇");
});

app.listen(PORT, () => {
  dbConnection();
  console.log(`Server running at port ${PORT}`);
});
