const db = require("../services/db");

// upload new design
exports.uploadDesign = async (req, res) => {
  try {
    console.log("🔥 UPLOAD HIT");
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    const { title, description, price, userId } = req.body;
    const imageUrl = req.file ? req.file.filename : null;

    const [result] = await db.query(
      "INSERT INTO designs (title, description, price, imageUrl, userId) VALUES (?, ?, ?, ?, ?)",
      [title, description, price, imageUrl, userId]
    );

    console.log("✅ INSERT SUCCESS:", result);

    res.json({
      success: true,
      message: "Design uploaded successfully"
    });
  } catch (error) {
    console.error("❌ UPLOAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Upload failed"
    });
  }
};
// get all designs for store
exports.getAllDesigns = async (req, res) => {
  try {
    console.log("🔥 getAllDesigns controller hit");

    const [designs] = await db.query(
      "SELECT * FROM designs ORDER BY id DESC"
    );

    res.json({
      success: true,
      designs
    });
  } catch (error) {
    console.error("GET ALL DESIGNS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load all products",
      error: error.message
    });
  }
};