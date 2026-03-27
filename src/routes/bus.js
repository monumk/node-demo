const express = require("express");
const router = express.Router();
const Bus = require("../models/Bus");
const validateFields = require("../utils/validateFields");


/**
 * @swagger
 * /api/bus/addBus:
 *   post:
 *     summary: Add bus
 *     tags: [Bus]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - busNumber
 *             properties:
 *               busNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: BUs added successfully
 */

router.post("/addBus",
    validateFields({ busNumber: "busNumber name is required" }),
    async (req, res) => {
        try {
            const no = req.body.busNumber;
            const busNumber = no.toUpperCase();
            let bus = await Bus.findOne({ busNumber: busNumber })
            if (bus) {
                return res.status(400).json({ msg: "Bus number already exists" });
            }

                bus = new Bus({
                    busNumber
                  });
            
            
            await bus.save();
            res.status(200).json({ msg: "Bus added successfully", bus });
        }
        catch(error) {
            res.status(500).json({ error: error.message });
        }
    })

/**
 * @swagger
 * /api/bus/list:
 *   post:
 *     summary: Bus list
 *     tags: [Bus]
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
 *       200:
 *         description: Bus fetched successfully
 */

router.post("/list", async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        const skip = (page - 1) * limit;
        const driver = await Bus.find({}).skip(skip).limit(limit);
        const total = await Bus.countDocuments({});

        res.status(200).json({
            msg: "Bus fetched successfully",
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            list: driver
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
})

module.exports = router;