const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const authRoutes = require("./src/routes/auth");
const productRoutes = require("./src/routes/products");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Swagger setup
const swaggerSpec = require("./src/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes); // ✅ THIS LINE IS CRITICAL
app.use("/api/products", productRoutes); // ✅ THIS LINE IS CRITICAL



// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});