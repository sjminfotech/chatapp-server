const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error", err));

app.use("/api", authRoutes);
app.use("/api/auth", authRoutes);
app.listen(5000, () => console.log("🚀 Server on http://localhost:5000"));
