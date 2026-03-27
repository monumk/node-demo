const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
    busNumber: ({type: String,  require: true}),
})

module.exports = mongoose.model("Bus", busSchema);