import { PDFDocument } from 'pdf-lib';

/**
 * Best-effort automatic page count for uploaded PDFs.
 * Returns null if the file isn't a parseable PDF (e.g. a scanned image, or a
 * corrupt/encrypted PDF) so the caller can fall back to asking the user.
 */
export async function countPdfPages(buffer) {
  try {
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    return doc.getPageCount();
  } catch (err) {
    return null;
  }
}
