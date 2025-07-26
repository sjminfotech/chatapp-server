const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error", err));

const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

app.listen(5000, () => console.log("🚀 Server on http://localhost:5000"));
