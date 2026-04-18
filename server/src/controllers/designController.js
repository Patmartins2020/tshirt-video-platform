const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "../data/designs.json");

function ensureFile() {
  const dir = path.dirname(dataFile);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]");
  }
}

function readDesigns() {
  ensureFile();
  const raw = fs.readFileSync(dataFile, "utf8");
  return JSON.parse(raw || "[]");
}

function writeDesigns(designs) {
  ensureFile();
  fs.writeFileSync(dataFile, JSON.stringify(designs, null, 2));
}

const uploadDesign = (req, res) => {
  try {
    console.log("🔥 uploadDesign hit");

    const designs = readDesigns();

    const newDesign = {
      id: Date.now(),
      title: req.body.title || "Untitled",
      description: req.body.description || "",
      price: Number(req.body.price || 0),
      userId: req.body.userId || "guest",
      imageUrl: req.file ? req.file.filename : "",
      createdAt: new Date().toISOString()
    };

    designs.push(newDesign);
    writeDesigns(designs);

    return res.json({
      success: true,
      design: newDesign
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message
    });
  }
};

const getAllDesigns = (req, res) => {
  try {
    console.log("🔥 getAllDesigns hit");
    console.log("📁 dataFile:", dataFile);

    const designs = readDesigns();

    console.log("✅ designs loaded:", designs);

    return res.json({
      success: true,
      designs
    });
  } catch (error) {
    console.error("GET ALL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load all products",
      error: error.message
    });
  }
};

const getMyDesigns = (req, res) => {
  try {
    console.log("🔥 getMyDesigns hit");

    const { userId } = req.params;
    const designs = readDesigns();

    const filtered = designs.filter(
      item => String(item.userId) === String(userId)
    );

    return res.json({
      success: true,
      designs: filtered
    });
  } catch (error) {
    console.error("GET MY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load user products",
      error: error.message
    });
  }
};

module.exports = {
  uploadDesign,
  getAllDesigns,
  getMyDesigns
};