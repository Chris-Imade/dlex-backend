const sendEmailWithCustomTemplate = require("../lib/sendEmailWithCustomTemplate");
const Product = require("../schemas/Product");
const User = require("../schemas/User");
const jwt = require("jsonwebtoken");
const createError = require("../lib/error");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configure Cloudinary with your credentials

cloudinary.config({
  cloud_name: "dtj0krpma",
  api_key: "389674485646689",
  api_secret: "EnWl1Ki8mXY_a3qHY3jI_dgcbeE",
});

// Create Products
const createProduct = async (req, res, next) => {
  // Find User and push product into
  const product = req.body;
  const currentUserId = req.query.userId; // Get the user's ID from the request

  try {
    // Check if a product with the same name already exists in the database
    const existingProduct = await Product.findOne({
      uniqueIdentifier: product.uniqueIdentifier,
    });

    if (!existingProduct) {
      // If the product with the same name does not exist, create a new product
      const newProduct = new Product({
        ...product,
        // userId: currentUserId, // No need to include userId
      });
      await newProduct.save();

      // Get the user's document to retrieve their products array
      const user = await User.findById(currentUserId);

      // Push the entire product object into the user's products array
      user.products.push(newProduct);

      // Save the updated user document
      await user.save();

      return res.status(201).json({
        message: "Success",
        status: 201,
        detail: "Product successfully created",
        product: newProduct,
      });
    } else {
      return res
        .status(200)
        .json({
          existingData: existingProduct.uniqueIdentifier,
          message: "Product already exists",
          detail: "Product with this id already exists",
        });
    }
  } catch (error) {
    next(error);
  }
};

// Update product
const updateProduct = async (req, res, next) => {
  const currentUserId = req.query.userId; // Get the user's ID from the request
  const productId = req.params.productId; // Get the product's ID from the request
  const updatedProduct = req.body; // Updated product data from the request body

  try {
    // Find the current user based on currentUserId
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User Not Found", status: 404 });
    }

    // Find the product within the user's products array by its ID
    const productIndex = currentUser.products.findIndex(
      (p) => p._id.toString() === productId
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product Not Found", status: 404 });
    }

    // Update the product data
    currentUser.products[productIndex] = {
      ...currentUser.products[productIndex],
      ...updatedProduct,
    };

    // Save the updated user document
    await currentUser.save();

    res.status(200).json(currentUser.products[productIndex]);
  } catch (error) {
    next(error);
  }
};

// Get Products
const getProducts = async (req, res, next) => {
  const currentUserId = req.query.userId; // Get the user's ID from the request

  try {
    // Find the current user based on currentUserId
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User Not Found", status: 404 });
    }

    // Access the products array of the current user
    const products = currentUser.products;

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// Get Product
const getProduct = async (req, res, next) => {
  const currentUserId = req.query.userId; // Get the user's ID from the request
  const productId = req.params.productId; // Get the product's ID from the request

  try {
    // Find the current user based on currentUserId
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User Not Found", status: 404 });
    }

    // Find the product within the user's products array by its ID
    const product = currentUser.products.find(
      (p) => p._id.toString() === productId
    );

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product Not Found", status: 404 });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  const currentUserId = req.query.userId; // Get the user's ID from the request
  const productId = req.params.productId; // Get the product's ID from the request

  try {
    // Find the current user based on currentUserId
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User Not Found", status: 404 });
    }

    // Log the product ID to check if it's correct

    // Find the index of the product within the user's products array by its ID
    const productIndex = currentUser.products.findIndex((product) =>
      product._id.equals(productId)
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product Not Found", status: 404 });
    }

    const product = currentUser.products[productIndex];
    // Get the user's email from the JWT token (assuming the token is in the "Authorization" header)
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your-secret-key' with your actual secret key
    const recipient = decodedToken.email;

    // Upload image to Cloudinary and get the image URL
    const uploadResult = await cloudinary.uploader.upload(
      `data:image/${product.imageFormat};base64,${product.image}`
    );
    const imageUrl = uploadResult.secure_url;
    // Send an email containing the product details and a styled email template
    const subject = `Product Deleted: ${product.name}`;

    // Call the function to send the email with the styled template and the image URL
    await sendEmailWithCustomTemplate(recipient, subject, product, imageUrl);

    // Remove the product from the user's products array using splice
    currentUser.products.splice(productIndex, 1); // With this the product is successfully deleted
    // Find product from product and delete as well
    await Product.findByIdAndDelete(productId);
    // Save the updated user document
    await currentUser.save();

    res.status(200).json({ message: "Product successfully deleted" });
  } catch (error) {
    // Log any errors that may occur during the process
    next(error);
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getProducts,
  getProduct,
  deleteProduct,
};
