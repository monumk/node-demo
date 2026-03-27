const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    driverName: ({type: String, require: true}),
    driverAge: ({type: Number, require: true}),
    driverAddress: ({type: String, require: true}),
    driverIdProof: ({type: String, require: true}),
    driverLicence: ({type: String, require: true}),
    createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Driver", driverSchema);