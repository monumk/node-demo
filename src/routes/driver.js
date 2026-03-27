const express = require("express");
const router = express.Router();
const Driver = require("../models/Driver");
const validateFields = require("../utils/validateFields");


/**
 * @swagger
 * /api/driver/addDriver:
 *   post:
 *     summary: Add driver
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - driverName
 *               - driverAge
 *               - driverAddress
 *               - driverIdProof
 *               - driverLicence
 *             properties:
 *               driverName:
 *                 type: string
 *               driverAge:
 *                 type: number
 *               driverAddress:
 *                 type: string
 *               driverIdProof:
 *                 type: string
 *               driverLicence:
 *                 type: string
 *     responses:
 *       201:
 *         description: Driver added successfully
 */

router.post(
    "/addDriver",
    validateFields({
        driverName: "driverName name is required",
        driverAge: "driverAge is required",
        driverAddress: "driverAddress is required",
        driverIdProof: "driverIdProof is required",
        driverLicence: "driverLicence is required",
    }),
    async (req, res) => {
        try {
            const {
                driverName,
                driverAge,
                driverAddress,
                driverIdProof,
                driverLicence,
            } = req.body;

            const normalizedName = driverName.toLowerCase();

            let driver = await Driver.findOne({ driverName: normalizedName });

            if (driver) {
                return res.status(400).json({ msg: "Driver name already exists" });
            }
            driver = new Driver({
                driverName: normalizedName,
                driverAge,
                driverAddress,
                driverIdProof,
                driverLicence
            });

            await driver.save();

            res.status(200).json({ msg: "Driver added successfully" });
        } catch (err) {
            res.status(500).json({ msg: "Server error" });
        }
    }
);


/**
 * @swagger
 * /api/driver/list:
 *   post:
 *     summary: Drivers list
 *     tags: [Driver]
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
 *         description: Drivers fetched successfully
 */

router.post("/list", async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        const skip = (page - 1) * limit;
        const driver = await Driver.find({}).skip(skip).limit(limit);
        const total = await Driver.countDocuments({});

        res.status(200).json({
            msg: "Drivers fetched successfully",
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

module.exports = router