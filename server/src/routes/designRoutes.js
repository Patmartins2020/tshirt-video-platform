const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  uploadDesign,
  getAllDesigns
} = require("../controllers/designController");

console.log("✅ designRoutes file loaded");

// multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// upload route
router.post("/upload", upload.single("image"), uploadDesign);

// fetch all designs
router.get("/all", getAllDesigns);

// test route
router.get("/all-test", (req, res) => {
  res.send("✅ /all-test route works");
});

module.exports = router;