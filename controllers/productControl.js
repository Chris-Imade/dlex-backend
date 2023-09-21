const Product = require('../schemas/Product');
const User = require('../schemas/User');

// Create Products
const createProduct = async (req, res, next) => {
    // Find User and push product into 
    const product = req.body;
    const currentUserId = req.query.userId; // Get the user's ID from the request
    
    // console.log(product);

    try {
      // Check if a product with the same name already exists in the database
      const existingProduct = await Product.findOne({
        uniqueIdentifier: product.uniqueIdentifier,
      });

      console.log(existingProduct);
  
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
  
        res.status(201).json({
          message: 'Success',
          status: 201,
          detail: 'Product successfully created',
          product: newProduct,
        });
      } else {
        return res
          .status(200)
          .json({ existingData: existingProduct.uniqueIdentifier, message: "Product already exists", detail: "Product with this id already exists" });
      }
    } catch (error) {
      next(error);
    }
}

// Update product
const updateProduct = async (req, res, next) => {
    const currentUserId = req.query.userId; // Get the user's ID from the request
    const productId = req.params.productId; // Get the product's ID from the request
    const updatedProduct = req.body; // Updated product data from the request body
  
    try {
      // Find the current user based on currentUserId
      const currentUser = await User.findById(currentUserId);
  
      if (!currentUser) {
        return res
          .status(404)
          .json({ message: 'User Not Found', status: 404 });
      }
  
      // Find the product within the user's products array by its ID
      const productIndex = currentUser.products.findIndex(
        (p) => p._id.toString() === productId
      );
  
      if (productIndex === -1) {
        return res
          .status(404)
          .json({ message: 'Product Not Found', status: 404 });
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
}

// Get Products
const getProducts = async (req, res, next) => {
    const currentUserId = req.query.userId; // Get the user's ID from the request
  
    try {
      // Find the current user based on currentUserId
      const currentUser = await User.findById(currentUserId);
      console.log(
        // "currentUser products: ", 
        // currentUser.username, 
        // currentUser
      );
  
      if (!currentUser) {
        return res
          .status(404)
          .json({ message: 'User Not Found', status: 404 });
      }
  
      // Access the products array of the current user
      const products = currentUser.products;


  
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
}

// Get Product
const getProduct = async (req, res, next) => {
    const currentUserId = req.query.userId; // Get the user's ID from the request
    const productId = req.params.productId; // Get the product's ID from the request
  
    try {
      // Find the current user based on currentUserId
      const currentUser = await User.findById(currentUserId);
  
      if (!currentUser) {
        return res
          .status(404)
          .json({ message: 'User Not Found', status: 404 });
      }
  
      // Find the product within the user's products array by its ID
      const product = currentUser.products.find(p => p._id.toString() === productId);
  
      if (!product) {
        return res
          .status(404)
          .json({ message: 'Product Not Found', status: 404 });
      }
  
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
}


const deleteProduct = async (req, res, next) => {
    const currentUserId = req.query.userId; // Get the user's ID from the request
    const productId = req.params.productId; // Get the product's ID from the request
  
    try {
      // Find the current user based on currentUserId
      const currentUser = await User.findById(currentUserId);
  
      if (!currentUser) {
        return res
          .status(404)
          .json({ message: 'User Not Found', status: 404 });
      }
  
      // Find the product within the user's products array by its ID
      const productExist = currentUser.products.filter((product) => {})
  
      if (productIndex === -1) {
        return res
          .status(404)
          .json({ message: 'Product Not Found', status: 404 });
      }
  
      // filter out the unwanted product
    //   const filteredProducts = currentUser.products.filter((product) => product._id === productId);
    //   currentUser.products.splice(productIndex, 1);

    //   console.log(filteredProducts);
      console.log(productIndex);
  
      // Save the updated user document
      await currentUser.save();
  
      res.status(200).json({ message: 'Product successfully deleted'});
    } catch (error) {
      next(error);
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getProducts,
    getProduct,
    deleteProduct,
}