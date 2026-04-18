const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./src/routes/authRoutes");
const designRoutes = require("./src/routes/designRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/designs", designRoutes);

app.get("/", (req, res) => {
  res.send("ROOT server is working");
});

app.listen(PORT, () => {
  console.log(`✅ ROOT server running on http://localhost:${PORT}`);
});