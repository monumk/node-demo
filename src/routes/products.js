const express = require("express");
const router = express.Router();
const Product = require("../models/Products");



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
router.post("/addProduct", async (req, res) => {
  try {
    const { productName, productPrice,productImage, productCategory } = req.body;

    // Check user exists
    let product = await Product.findOne({ productName });
    if (product) return res.status(400).json({ msg: "product already exists" });


    // Save user
    product = new Product({ productName, productPrice,productImage, productCategory });
    await product.save();

    res.status(201).json({ msg: "Product added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


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

module.exports = router;