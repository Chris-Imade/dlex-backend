const express = require("express");
const { 
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    createProduct
} = require("../controllers/productControl");
const { verifyToken } = require("../lib/verifyToken");
const multer = require('multer');
const upload = multer();

const router = express.Router();

router.post("/", upload.none(), createProduct);
router.get("/", verifyToken, getProducts);
router.get("/:productId/", verifyToken, getProduct);
router.put("/:productId/", verifyToken, updateProduct);
router.delete("/:productId/", verifyToken, deleteProduct);

module.exports = router;