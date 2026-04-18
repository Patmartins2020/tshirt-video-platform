const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  uploadDesign,
  getAllDesigns,
  getMyDesigns
} = require("../controllers/designController");

console.log("✅ designRoutes loaded");

/* =================================
   PATHS
================================= */
const uploadsDir = path.join(__dirname, "../uploads");
const dataDir = path.join(__dirname, "../data");
const designsFile = path.join(dataDir, "designs.json");

/* =================================
   CREATE FOLDERS / FILES
================================= */
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(designsFile)) {
  fs.writeFileSync(designsFile, "[]");
}

/* =================================
   HELPERS
================================= */
function readDesigns() {
  return JSON.parse(fs.readFileSync(designsFile, "utf8"));
}

function saveDesigns(data) {
  fs.writeFileSync(
    designsFile,
    JSON.stringify(data, null, 2)
  );
}

/* =================================
   MULTER
================================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },

  filename: (req, file, cb) => {
    const fileName =
      Date.now() + "-" +
      file.originalname.replace(/\s+/g, "-");

    cb(null, fileName);
  }
});

const upload = multer({ storage });

/* =================================
   TEST ROUTE
================================= */
router.get("/all-test", (req, res) => {
  res.json({
    success: true,
    message: "designRoutes working"
  });
});

/* =================================
   MAIN ROUTES
================================= */

/* Upload product */
router.post(
  "/upload",
  upload.single("image"),
  uploadDesign
);

/* Seller products */
router.get(
  "/my-designs/:userId",
  getMyDesigns
);

/* All products */
router.get(
  "/all",
  getAllDesigns
);

/* =================================
   DELETE PRODUCT
================================= */
router.delete("/delete/:id", (req, res) => {
  try {
    const id = req.params.id;

    let designs = readDesigns();

    const product = designs.find(
      item => String(item.id) === String(id)
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    /* delete image file */
    if (product.imageUrl) {

      const cleanName =
        product.imageUrl.replace("uploads/", "");

      const imagePath =
        path.join(uploadsDir, cleanName);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    designs = designs.filter(
      item => String(item.id) !== String(id)
    );

    saveDesigns(designs);

    return res.json({
      success: true,
      message: "Product deleted"
    });

  } catch (error) {

    console.log("DELETE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* =================================
   LIVE ON / OFF
================================= */
router.put("/live/:id", (req, res) => {
  try {

    const id = req.params.id;
    const { isLive } = req.body;

    let designs = readDesigns();

    const index = designs.findIndex(
      item => String(item.id) === String(id)
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    designs[index].isLive = isLive;

    saveDesigns(designs);

    return res.json({
      success: true,
      message: isLive
        ? "Product is now live"
        : "Product hidden",
      isLive
    });

  } catch (error) {

    console.log("LIVE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* =================================
   EXPORT
================================= */
module.exports = router;