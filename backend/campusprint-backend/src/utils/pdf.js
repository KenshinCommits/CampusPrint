const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

// Tries to count pages from an uploaded PDF. If it's not a real/valid PDF
// (or something goes wrong), falls back to whatever the student typed in manually.
async function countPages(filePath, manualPagesFallback) {
  try {
    const bytes = fs.readFileSync(filePath);
    const doc = await PDFDocument.load(bytes);
    return doc.getPageCount();
  } catch (err) {
    const fallback = parseInt(manualPagesFallback, 10);
    if (fallback && fallback > 0) return fallback;
    return 1; // last resort so cost calc never crashes
  }
}

module.exports = { countPages };
