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
            const busNumber = req.body.busNumber;
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

module.exports = router;