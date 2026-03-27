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
 *               - driverLicenceNumber
 *             properties:
 *               driverName:
 *                 type: string
 *               driverAge:
 *                 type: number
 *               driverAddress:
 *                 type: string
 *               driverIdProof:
 *                 type: string
 *               driverLicenceNumber:
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
        driverLicenceNumber: "driverLicence is required",
    }),
    async (req, res) => {
        try {
            const {
                driverName,
                driverAge,
                driverAddress,
                driverIdProof,
                driverLicenceNumber,
            } = req.body;

            if(driverAge<18){
                return res.status(400).json({ msg: "Driver age must be greater then 18." });
            }

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
                driverLicenceNumber
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
 * /api/driver/updateDriver/{id}:
 *   put:
 *     summary: Update driver
 *     tags: [Driver]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the driver to delete
 *         schema:
 *           type: string
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
 *               - driverLicenceNumber
 *             properties:
 *               driverName:
 *                 type: string
 *               driverAge:
 *                 type: number
 *               driverAddress:
 *                 type: string
 *               driverIdProof:
 *                 type: string
 *               driverLicenceNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Driver updated successfully
 */

router.put("/updateDriver/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid driver ID" });
        }

        const {
            driverName,
            driverAge,
            driverAddress,
            driverIdProof,
            driverLicenceNumber,
        } = req.body;

        if(driverAge<18){
            return res.status(400).json({ msg: "Driver age must be greater then 18." });
        }

        const driver = await Driver.findById(id);

        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        // Update only if values are provided
        if (driverName) driver.driverName = driverName.toLowerCase();
        if (driverAge) driver.driverAge = driverAge;
        if (driverAddress) driver.driverAddress = driverAddress;
        if (driverIdProof) driver.driverIdProof = driverIdProof;
        if (driverLicenceNumber) driver.driverLicenceNumber = driverLicenceNumber;

        await driver.save();

        res.status(200).json({
            message: "Driver updated successfully",
            driver
        });

    } catch (err) {
        res.status(500).json({
            message: "Error updating driver",
            error: err.message
        });
    }
});



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



/**
 * @swagger
 * /api/driver/deleteDriver/{id}:
 *   delete:
 *     summary: Delete a driver by ID
 *     description: Deletes a driver from the database using the provided driver ID.
 *     tags:
 *       - Driver
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the driver to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Driver deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Driver deleted successfully
 *       404:
 *         description: Driver not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Driver not found
 *       500:
 *         description: Server error while deleting driver
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting driver
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.delete("/deleteDriver/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Driver.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Driver not found" });
        }
        res.status(200).json({ message: "Driver deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting driver", error: err.message });
    }
});

module.exports = router