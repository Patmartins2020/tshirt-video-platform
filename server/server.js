const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

const authRoutes = require("./src/routes/auth");
const designRoutes = require("./src/routes/designRoutes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* serve uploaded images */
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

/* api routes */
app.use("/api/auth", authRoutes);
app.use("/api/designs", designRoutes);

/* home test */
app.get("/", (req, res) => {
  res.send("Backend running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});