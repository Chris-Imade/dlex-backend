const express = require("express");
const { 
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    createProduct
} = require("../controllers/products");
const { verifyToken } = require("../lib/verifyToken");
const multer = require('multer');
const upload = multer();

const router = express.Router();

router.post("/:userId", upload.none(), createProduct);
router.get("/:userId", verifyToken, getProducts);
router.get("/:productId/:userId", verifyToken, getProduct);
router.put("/:productId/:userId", verifyToken, updateProduct);
router.delete("/:productId/:userId", verifyToken, deleteProduct);

module.exports = router;