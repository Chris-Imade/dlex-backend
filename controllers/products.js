const jwt = require('jsonwebtoken');
const Product = require("../schemas/Product");
const sendEmailWithCustomTemplate = require('../lib/sendEmailWithCustomTemplate');
const createError = require('../lib/error');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary with your credentials
          
cloudinary.config({ 
    cloud_name: 'dtj0krpma', 
    api_key: '389674485646689', 
    api_secret: 'EnWl1Ki8mXY_a3qHY3jI_dgcbeE' 
});
  

// Create Product // New Products should now contain the userId
const createProduct = async (req, res, next) => {
    const product = req.body;

    try {
        // Check if a product with the same name already exists in the database
        const existingProduct = await Product.findOne({ uniqueIdentifier: product.uniqueIdentifier });

        if (!existingProduct) {
            // If the product with the same name does not exist, create a new product
            const newProduct = new Product(product);
            await newProduct.save();
    
            res.status(201).json({
            message: "Success",
            status: 201,
            detail: "Product successfully created",
            product: newProduct,
            });
        } else {
            return res.status(200).json({ existingData: existingProduct.uniqueIdentifier});
        }

    } catch (error) {
        next(error);
    }
};
  

// Get all products
const getProducts = (req, res, next) => {

  const userId = req.query.userId;

    Product.find({ userId }).then((products) => {
        res.status(200).json(products);
    }).catch((err) => {
        next(err);
    })
}

// Get single product
const getProduct = (req, res, next) => {
    const productId = req.params.productId;
    const userId = req.query.userId;

    Product.findById(productId).then((product) => {
      if(product) {
        if(userId !== product.userId) {
          res.status(403).json({ message: 'You are not allowed to request this product!', status: 403, details: 'You can only request for products you created, our clients confidentiality is our top priority' })
        } else {
          res.status(200).json(product);
        }        
      } else {
        res.status(404).json({ message: "Failed", status: 404, detail: "Product not found" });
      }
  }).catch((err) => {
      next(err);
  })
}

// Update product
const updateProduct = async (req, res, next) => {
    const productId = req.params.productId;
    const userId = req.query.userId;
    const newProduct = req.body;

    Product.findById(productId).then((product) => {
        if(product.userId === userId) {
          Product.findByIdAndUpdate(productId, { $set: newProduct }, { new: true }).then((product) => {
              res.status(200).json(product);
          }).catch((err) => {
              createError(404, 'Product not found 😥', err);
          })
        } else {
          res.status(403).json({ message: 'You can\'t proceed with this request as you are not authorized', status: 403, details: 'You can\'t edit or make modifications to a product you did not create' })
        }
    }).catch(err => createError(403, 'You can\'t proceed with this request as you are not authorized', err));
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