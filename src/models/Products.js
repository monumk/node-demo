const mongoose = require("mongoose");
const productsSchema = new mongoose.Schema({
    productName: {type: String, require: true},
    productPrice: {type: Number, require: true},
    productImage: {type: String, require: false},
    productCategory: {type: String, require: true},
})

module.exports = mongoose.model("Products", productsSchema);