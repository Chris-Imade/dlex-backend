const jwt = require('jsonwebtoken');
const Product = require("../schemas/Product");
const sendEmailWithCustomTemplate = require('../lib/sendEmailWithCustomTemplate');
const User = require('../schemas/User');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary with your credentials
          
cloudinary.config({ 
    cloud_name: 'dtj0krpma', 
    api_key: '389674485646689', 
    api_secret: 'EnWl1Ki8mXY_a3qHY3jI_dgcbeE' 
});
  

// Create Product
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
        
        // Get the user's document to retrieve their products array and include the _id field
        const user = await User.findById(currentUserId).select('products');

        if(user) {
            const newProduct = new Product(product);
            await newProduct.save();
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
        }
        res.status(400).json({
          message: 'Failed',
          status: 400,
          detail: 'User not Found',
          userId: currentUserId,
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
  

// Get all products
const getProducts = async (req, res, next) => {
    const currentUserId = req.params.userId; // Get the user's ID from the request
    console.log('User currentId: ', currentUserId);

    // try {
    //   // Find the current user based on currentUserId
    //   const currentUser = await User.findById(currentUserId).populate('products');
  
    //   if (!currentUser) {
    //     return res
    //       .status(404)
    //       .json({ message: 'User Not Found', status: 404 });
    //   }
  
    //   // Access the products array of the current user
    //   const products = currentUser.products;

    //   res.status(200).json(currentUser);
  
    // } catch (error) {
    //   next(error);
    // }
  };

// Get single product
const getProduct = (req, res, next) => {
    const productId = req.params.productId;

    Product.findById(productId).then((product) => {
        if(product) {
            res.status(200).json(product);
        }

        res.status(404).json({ message: "Failed", status: 404, detail: "Product not found" });
    }).catch((err) => {
        next(err);
    })
}

// Update product
const updateProduct = (req, res, next) => {
    const productId = req.params.productId;
    const newProduct = req.body;

    Product.findByIdAndUpdate(productId, { $set: newProduct }, { new: true }).then((product) => {
        res.status(200).json(product);
    }).catch((err) => {
        next(err);
    })
}



// delete product
const deleteProduct = async (req, res, next) => {
    const productId = req.params.productId;

    try {
        // Find the product to get its details before deleting
        const product = await Product.findById(productId);

        if (!product) {
        return res.status(404).json({ message: "Product Not Found", status: 404, detail: `The product with the id ${productId} was not found` });
        }

        // Get the user's email from the JWT token (assuming the token is in the "Authorization" header)
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your-secret-key' with your actual secret key
        const recipient = decodedToken.email;

        console.log("Recipient: ", recipient);

        // Upload image to Cloudinary and get the image URL
        const uploadResult = await cloudinary.uploader.upload(`data:image/${product.imageFormat};base64,${product.image}`);
        const imageUrl = uploadResult.secure_url;
        console.log("Cloudinary Image: ", imageUrl);
        // Send an email containing the product details and a styled email template
        const subject = `Product Deleted: ${product.name}`;

        // Call the function to send the email with the styled template and the image URL
        await sendEmailWithCustomTemplate(recipient, subject, product, imageUrl);

        // Delete the product from the database after sending the email
        await Product.findByIdAndDelete(productId);

        res.status(200).json({ message: "Success", status: 200, detail: "Product successfully deleted"});
    } catch (error) {
        next(error);
    }
};




module.exports = {
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    createProduct
}