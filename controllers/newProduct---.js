const createProduct = async (req, res, next) => {
    const product = req.body;
    const currentUserId = req.params.userId; // Get the user's ID from the request
  
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
  
        res.status(201).json({
          message: 'Success',
          status: 201,
          detail: 'Product successfully created',
          product: newProduct,
        });
      } else {
        return res
          .status(200)
          .json({ existingData: existingProduct.uniqueIdentifier });
      }
    } catch (error) {
      next(error);
    }
  };
  

  // Get products of the current user
const getProducts = async (req, res, next) => {
    const currentUserId = req.params.userId; // Get the user's ID from the request
  
    try {
      // Find the current user based on currentUserId
      const currentUser = await User.findById(currentUserId).populate('products');
  
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
  };
  


  // Get a single product of the current user
const getSingleProduct = async (req, res, next) => {
    const currentUserId = req.params.userId; // Get the user's ID from the request
    const productId = req.params.productId; // Get the product's ID from the request
  
    try {
      // Find the current user based on currentUserId
      const currentUser = await User.findById(currentUserId).populate('products');
  
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
  };
  

  // Update a single product of the current user
const updateSingleProduct = async (req, res, next) => {
    const currentUserId = req.params.userId; // Get the user's ID from the request
    const productId = req.params.productId; // Get the product's ID from the request
    const updatedProduct = req.body; // Updated product data from the request body
  
    try {
      // Find the current user based on currentUserId
      const currentUser = await User.findById(currentUserId).populate('products');
  
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
  };
  