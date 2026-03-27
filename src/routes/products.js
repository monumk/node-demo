const express = require("express");
const router = express.Router();
const Product = require("../models/Products");
const validateFields = require("../utils/validateFields");



/**
 * @swagger
 * /api/products/addProduct:
 *   post:
 *     summary: Add new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - productPrice
 *               - productImage
 *               - productCategory
 *             properties:
 *               productName:
 *                 type: string
 *               productPrice:
 *                 type: number
 *               productImage:
 *                 type: string
 *               productCategory:
 *                 type: string 
 *     responses:
 *       201:
 *         description: Product added successfully
 */
router.post(
  "/addProduct",
  validateFields({
    productName: "Product name is required",
    productPrice: "Product price is required",
    productImage: "Product image is required",
    productCategory: "Product category is required",
  }),
  async (req, res) => {
    try {
      const { productName, productPrice, productImage, productCategory } = req.body;

      let product = await Product.findOne({ productName });
      if (product) {
        return res.status(400).json({ msg: "Product already exists" });
      }

      product = new Product({
        productName,
        productPrice,
        productImage,
        productCategory,
      });

      await product.save();

      res.status(201).json({ msg: "Product added successfully" });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


/**
 * @swagger
 * /api/products/updateProduct:
 *   patch:
 *     summary: Update product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - productPrice
 *               - productImage
 *               - productCategory
 *               - productId
 *             properties:
 *               productName:
 *                 type: string
 *               productPrice:
 *                 type: number
 *               productImage:
 *                 type: string
 *               productCategory:
 *                 type: string 
 *               productId:
 *                 type: string 
 *     responses:
 *       201:
 *         description: Product updated successfully
 */

router.patch(
  "/updateProduct",
  validateFields({
    productName: "Product name is required",
    productPrice: "Product price is required",
    productImage: "Product image is required",
    productCategory: "Product category is required",
    productId: "Product id is required",
  }),
  async (req, res) => {
    try {
      const { productName, productPrice, productImage, productCategory, productId } = req.body;

      let product = await Product.findById(productId);

      if (!product) {
        return res.status(400).json({ msg: "Product not exists" });
      }
      product.productName = productName;
      product.productPrice = productPrice;
      product.productImage = productImage;
      product.productCategory = productCategory;

      await product.save();

      res.status(200).json({ msg: "Product updated successfully", product });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


/**
 * @swagger
 * /api/products/list:
 *   post:
 *     summary: product list
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - page
 *               - limit
 *             properties:
 *               page:
 *                 type: number
 *               limit:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product added successfully
 */

router.post("/list", async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const skip = (page - 1) * limit;
    const products = await Product.find({}).skip(skip).limit(limit);
    const total = await Product.countDocuments({});

    res.status(200).json({
      msg: "Products fetched successfully",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      list: products
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/**
 * @swagger
 * /api/products/deleteProduct:
 *   post:
 *     summary: delete product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product added successfully
 */
router.post("/deleteProduct", async (req, res) => {
  try {
    const id = req.body.id; // keep it as string

    const result = await Product.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;