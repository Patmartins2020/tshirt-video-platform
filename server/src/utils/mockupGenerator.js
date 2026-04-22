const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

async function generateTshirtMockup(designImagePath) {
  const templatesDir = path.join(__dirname, "../templates");
  const uploadsDir = path.join(__dirname, "../uploads");
  const mockupsDir = path.join(uploadsDir, "mockups");

  if (!fs.existsSync(mockupsDir)) {
    fs.mkdirSync(mockupsDir, { recursive: true });
  }

  const tshirtTemplatePath = path.join(templatesDir, "tshirt-white.png");

  if (!fs.existsSync(tshirtTemplatePath)) {
    throw new Error("tshirt-white.png template not found in server/src/templates");
  }

  const templateMeta = await sharp(tshirtTemplatePath).metadata();

  const templateWidth = templateMeta.width;
  const templateHeight = templateMeta.height;

  const printWidth = Math.round(templateWidth * 0.28);
  const printTop = Math.round(templateHeight * 0.30);
  const printLeft = Math.round((templateWidth - printWidth) / 2);

  const outputFileName = `mockup-${Date.now()}.png`;
  const outputPath = path.join(mockupsDir, outputFileName);

  const resizedDesignBuffer = await sharp(designImagePath)
    .resize({ width: printWidth })
    .png()
    .toBuffer();

  await sharp(tshirtTemplatePath)
    .composite([
      {
        input: resizedDesignBuffer,
        top: printTop,
        left: printLeft
      }
    ])
    .png()
    .toFile(outputPath);

  return `mockups/${outputFileName}`;
}

module.exports = { generateTshirtMockup };