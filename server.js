require("dotenv").config({ path: "./mongooseDB.env" });

const express = require("express");
const mongoose = require("mongoose");

const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
